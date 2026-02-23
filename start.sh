#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#  AI 编程教程 — 启停管理脚本
#  用法: ./start.sh [命令]
#
#  命令:
#    dev          启动开发服务器 (热重载)
#    build        构建静态站点
#    preview      预览构建产物
#    stop         停止开发/预览服务
#
#    docker-build 构建容器镜像 (podman/docker)
#    docker-run   运行容器
#    docker-stop  停止容器
#
#    k8s-deploy   部署到 Kubernetes
#    k8s-delete   从 Kubernetes 删除
# ============================================================

APP_NAME="ai-coding-guide"
IMAGE_NAME="${IMAGE_NAME:-ai-coding-guide}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
CONTAINER_NAME="${APP_NAME}"
DEV_PORT="${DEV_PORT:-5173}"
PREVIEW_PORT="${PREVIEW_PORT:-4173}"
CONTAINER_PORT="${CONTAINER_PORT:-8080}"
K8S_NAMESPACE="${K8S_NAMESPACE:-default}"
PID_DIR="./.pids"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✗]${NC} $*" >&2; }

# ---------- 容器运行时检测 ----------
detect_runtime() {
    if command -v podman &>/dev/null; then
        echo "podman"
    elif command -v docker &>/dev/null; then
        echo "docker"
    else
        err "未检测到 podman 或 docker，请先安装"
        exit 1
    fi
}

# ---------- 开发模式 ----------
cmd_dev() {
    mkdir -p "$PID_DIR"
    if [ -f "$PID_DIR/dev.pid" ] && kill -0 "$(cat "$PID_DIR/dev.pid")" 2>/dev/null; then
        warn "开发服务器已在运行 (PID: $(cat "$PID_DIR/dev.pid"))"
        warn "访问: http://localhost:${DEV_PORT}"
        return
    fi
    log "启动开发服务器 (端口: ${DEV_PORT})..."
    npx vitepress dev docs --port "$DEV_PORT" &
    echo $! > "$PID_DIR/dev.pid"
    sleep 2
    log "开发服务器已启动: http://localhost:${DEV_PORT}"
    log "停止: ./start.sh stop"
    wait
}

cmd_build() {
    log "构建静态站点..."
    npx vitepress build docs
    log "构建完成: docs/.vitepress/dist/"
}

cmd_preview() {
    mkdir -p "$PID_DIR"
    if [ -f "$PID_DIR/preview.pid" ] && kill -0 "$(cat "$PID_DIR/preview.pid")" 2>/dev/null; then
        warn "预览服务器已在运行 (PID: $(cat "$PID_DIR/preview.pid"))"
        return
    fi
    log "启动预览服务器 (端口: ${PREVIEW_PORT})..."
    npx vitepress preview docs --port "$PREVIEW_PORT" &
    echo $! > "$PID_DIR/preview.pid"
    sleep 2
    log "预览服务器已启动: http://localhost:${PREVIEW_PORT}"
    wait
}

cmd_stop() {
    local stopped=0
    for name in dev preview; do
        local pidfile="$PID_DIR/${name}.pid"
        if [ -f "$pidfile" ]; then
            local pid
            pid=$(cat "$pidfile")
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null || true
                log "已停止 ${name} 服务 (PID: ${pid})"
                stopped=1
            fi
            rm -f "$pidfile"
        fi
    done
    if [ "$stopped" -eq 0 ]; then
        warn "没有正在运行的服务"
    fi
}

# ---------- 容器模式 ----------
ensure_containerfile() {
    if [ ! -f Containerfile ] && [ ! -f Dockerfile ]; then
        log "生成 Containerfile..."
        cat > Containerfile << 'EOF'
# ---- 阶段 1: 构建 ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN corepack enable && \
    ([ -f pnpm-lock.yaml ] && pnpm install --frozen-lockfile || npm ci)
COPY . .
RUN ([ -f pnpm-lock.yaml ] && pnpm docs:build || npm run docs:build)

# ---- 阶段 2: 运行 ----
FROM nginx:alpine
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
COPY <<-'NGINX' /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
NGINX
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
EOF
        log "Containerfile 已生成"
    fi
}

cmd_docker_build() {
    local runtime
    runtime=$(detect_runtime)
    ensure_containerfile
    local cfile="Containerfile"
    [ -f Dockerfile ] && [ ! -f Containerfile ] && cfile="Dockerfile"
    log "使用 ${runtime} 构建镜像: ${IMAGE_NAME}:${IMAGE_TAG}"
    $runtime build -t "${IMAGE_NAME}:${IMAGE_TAG}" -f "$cfile" .
    log "镜像构建完成"
}

cmd_docker_run() {
    local runtime
    runtime=$(detect_runtime)
    if $runtime ps --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$" || \
       $runtime ps -a --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
        warn "容器 ${CONTAINER_NAME} 已存在，先停止..."
        $runtime rm -f "${CONTAINER_NAME}" 2>/dev/null || true
    fi
    log "启动容器 (端口: ${CONTAINER_PORT})..."
    $runtime run -d \
        --name "${CONTAINER_NAME}" \
        -p "${CONTAINER_PORT}:8080" \
        "${IMAGE_NAME}:${IMAGE_TAG}"
    log "容器已启动: http://localhost:${CONTAINER_PORT}"
    log "停止: ./start.sh docker-stop"
}

cmd_docker_stop() {
    local runtime
    runtime=$(detect_runtime)
    if $runtime ps --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"; then
        $runtime stop "${CONTAINER_NAME}" && $runtime rm "${CONTAINER_NAME}"
        log "容器已停止并移除"
    else
        warn "容器 ${CONTAINER_NAME} 未在运行"
    fi
}

# ---------- Kubernetes ----------
ensure_k8s_manifests() {
    if [ ! -f k8s/deployment.yaml ]; then
        mkdir -p k8s
        cat > k8s/deployment.yaml << YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${APP_NAME}
  labels:
    app: ${APP_NAME}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ${APP_NAME}
  template:
    metadata:
      labels:
        app: ${APP_NAME}
    spec:
      containers:
        - name: ${APP_NAME}
          image: ${IMAGE_NAME}:${IMAGE_TAG}
          ports:
            - containerPort: 8080
          resources:
            requests:
              cpu: 50m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 128Mi
          livenessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 8080
            initialDelaySeconds: 3
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ${APP_NAME}
spec:
  selector:
    app: ${APP_NAME}
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${APP_NAME}
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: ai-guide.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${APP_NAME}
                port:
                  number: 80
YAML
        log "k8s/deployment.yaml 已生成 (请修改 Ingress host)"
    fi
}

cmd_k8s_deploy() {
    ensure_k8s_manifests
    log "部署到 Kubernetes (namespace: ${K8S_NAMESPACE})..."
    kubectl apply -f k8s/ -n "${K8S_NAMESPACE}"
    log "等待 Pod 就绪..."
    kubectl rollout status deployment/"${APP_NAME}" -n "${K8S_NAMESPACE}" --timeout=120s
    log "部署完成"
    kubectl get pods -l app="${APP_NAME}" -n "${K8S_NAMESPACE}"
}

cmd_k8s_delete() {
    log "从 Kubernetes 删除..."
    kubectl delete -f k8s/ -n "${K8S_NAMESPACE}" --ignore-not-found
    log "已删除"
}

# ---------- 帮助 ----------
cmd_help() {
    cat << 'HELP'
用法: ./start.sh <命令>

开发:
  dev             启动开发服务器 (热重载, 默认端口 5173)
  build           构建静态站点到 docs/.vitepress/dist/
  preview         预览构建产物 (默认端口 4173)
  stop            停止开发/预览服务

容器:
  docker-build    构建容器镜像 (自动检测 podman/docker)
  docker-run      运行容器 (默认端口 8080)
  docker-stop     停止并移除容器

Kubernetes:
  k8s-deploy      部署到 K8s (自动生成 manifests)
  k8s-delete      从 K8s 删除

环境变量:
  DEV_PORT        开发服务器端口     (默认: 5173)
  PREVIEW_PORT    预览服务器端口     (默认: 4173)
  CONTAINER_PORT  容器映射端口       (默认: 8080)
  IMAGE_NAME      镜像名称          (默认: ai-coding-guide)
  IMAGE_TAG       镜像标签          (默认: latest)
  K8S_NAMESPACE   K8s 命名空间      (默认: default)

示例:
  ./start.sh dev                          # 本地开发
  ./start.sh build && ./start.sh preview  # 构建并预览
  ./start.sh docker-build && ./start.sh docker-run  # 容器部署
  IMAGE_TAG=v1.0 ./start.sh docker-build  # 指定镜像标签
  K8S_NAMESPACE=prod ./start.sh k8s-deploy  # 部署到 K8s
HELP
}

# ---------- 入口 ----------
case "${1:-help}" in
    dev)          cmd_dev ;;
    build)        cmd_build ;;
    preview)      cmd_preview ;;
    stop)         cmd_stop ;;
    docker-build) cmd_docker_build ;;
    docker-run)   cmd_docker_run ;;
    docker-stop)  cmd_docker_stop ;;
    k8s-deploy)   cmd_k8s_deploy ;;
    k8s-delete)   cmd_k8s_delete ;;
    help|--help|-h) cmd_help ;;
    *) err "未知命令: $1"; cmd_help; exit 1 ;;
esac
