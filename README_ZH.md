# AI 编程从入门到实战

> 为 IT 部门打造的 AI 编程科普教程 — 从零到实战，问题驱动，每个概念都有可运行的 Demo

**[English Version](README.md)**

[![VitePress](https://img.shields.io/badge/VitePress-1.6-646CFF?logo=vitepress)](https://vitepress.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?logo=jupyter)](https://jupyter.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 项目简介

这是一个面向 IT 部门同事的 **AI 编程知识科普平台**，采用 VitePress 文档站点 + Python Jupyter Notebook Demo 的综合方案。

**核心设计原则：**

- **先体验，再理解** — 每个概念先让你"跑起来"，再讲原理
- **问题驱动** — 每节以"你在工作中会遇到什么问题"开头
- **多入口** — 速成路径（3 小时）、角色路径、完整路径三种学习方式

**内容规模：**

| 指标 | 数量 |
|------|------|
| 篇章 | 6 篇 16 章 60+ 节 |
| 文档 | 55+ 个 Markdown 文件，30,000+ 行 |
| Demo | 39 个 Jupyter Notebook |
| 附录 | 术语表（70+ 术语）、技术雷达、资源索引、FAQ |

---

## 技术架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户访问层                                │
│  ┌──────────────────────┐    ┌───────────────────────────────┐  │
│  │   浏览器访问           │    │   Google Colab / 本地 Jupyter  │  │
│  │   VitePress 静态站点   │    │   一键运行 Notebook Demo      │  │
│  └──────────┬───────────┘    └──────────────┬────────────────┘  │
└─────────────┼───────────────────────────────┼───────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌───────────────────────────────────┐
│     文档站点 (VitePress)  │    │        Demo 代码 (Python)         │
│                         │    │                                   │
│  ● 55 个 Markdown 文档   │    │  ● 39 个 Jupyter Notebook         │
│  ● Mermaid 图表          │───▶│  ● OpenAI / Anthropic / Google   │
│  ● 自定义 Vue 组件       │    │  ● DeepSeek / Qwen / Mistral     │
│  ● 本地全文搜索          │    │  ● Ollama 本地模型               │
│  ● 移动端适配            │    │  ● ChromaDB 向量数据库           │
└─────────────────────────┘    └───────────────────────────────────┘
```

---

## 课程全景图

```
                        ┌──────────────────────┐
                        │  第一篇：入门篇        │
                        │                      │
                        │  Ch1  3 分钟体验 AI    │
                        │   ↓                  │
                        │  Ch2  AI 全景与平台    │
                        │   ↓                  │
                        │  Ch3  LLM 核心原理    │
                        │   ↓                  │
                        │  Ch4  Prompt 工程     │
                        └──────────┬───────────┘
                                   │
                        ┌──────────▼───────────┐
                        │  第二篇：工具篇        │
                        │                      │
                        │  Ch5  AI 编程工具     │
                        │   ↓                  │
                        │  Ch6  Context 工程    │
                        └──────────┬───────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
┌─────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  第三篇：能力篇       │ │  第四篇：生态篇    │ │                  │
│                     │ │                  │ │                  │
│  Ch7  Function Call │ │  Ch11 MCP/A2A    │ │                  │
│   ↓                 │ │   ↓              │ │                  │
│  Ch8  多模态 AI     │ │  Ch12 RAG/记忆   │ │                  │
│   ↓                 │ │                  │ │                  │
│  Ch9  AI Agent      │ └────────┬─────────┘ │                  │
│   ↓                 │          │            │                  │
│  Ch10 Multi-Agent   │          │            │                  │
└─────────┬───────────┘          │            │                  │
          │                      │            │                  │
          └──────────┬───────────┘            │                  │
                     ▼                        │                  │
          ┌──────────────────┐                │                  │
          │  第五篇：生产篇    │                │                  │
          │                  │                │                  │
          │  Ch13 生产化      │                │                  │
          │  护栏/评估/监控   │                │                  │
          └────────┬─────────┘                │                  │
                   ▼                          │                  │
          ┌──────────────────┐                │                  │
          │  第六篇：实战篇    │                │                  │
          │                  │                │                  │
          │  Ch14 IT 实战     │                │                  │
          │  知识库/Review/   │                │                  │
          │  运维/工具链      │                │                  │
          └──────────────────┘                │                  │
```

**每章内容速览：**

| 篇 | 章 | 标题 | 核心内容 |
|----|-----|------|---------|
| 入门 | Ch1 | 3 分钟体验 AI | 3 行代码 + 免费方案 |
| 入门 | Ch2 | AI 全景与模型平台 | 6 大提供商 + OpenRouter + Ollama 本地部署 |
| 入门 | Ch3 | LLM 核心原理 | Token + 参数 + 推理模型 (o3/R1) |
| 入门 | Ch4 | Prompt Engineering | 基础 + CoT + 结构化输出 |
| 工具 | Ch5 | AI 编程工具全景 | Cursor + Claude Code + Codex CLI + 选型 |
| 工具 | Ch6 | Context Engineering | AGENTS.md + Rules + Vibe Coding |
| 能力 | Ch7 | Function Calling | FC + Tool Use + Streaming + 编排 |
| 能力 | Ch8 | 多模态 AI | Vision + 图像生成 + 语音 + Realtime |
| 能力 | Ch9 | AI Agent | ReAct + Agents SDK + Computer Use |
| 能力 | Ch10 | Multi-Agent | 架构 + Handoff + 研究系统 |
| 生态 | Ch11 | MCP / A2A / ANP | 三大协议详解 + 选型指南 |
| 生态 | Ch12 | RAG & 记忆存储 | 向量搜索 + 高级 RAG + Memory |
| 生产 | Ch13 | 生产化 | 护栏 + 评估 + 可观测 + Prompt Caching |
| 实战 | Ch14 | IT 部门实战 | 知识库 + Code Review + 运维 + 工具链 |

---

## 内容写作规范

每一节严格遵循 **四段式结构**：

```
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌────────────┐
  │  Why    │───▶│  What   │───▶│  How    │───▶│ Reflection │
  │ 为什么   │    │ 是什么   │    │ 动手试   │    │ 小结       │
  │ 需要它？ │    │         │    │         │    │            │
  └─────────┘    └─────────┘    └─────────┘    └─────┬──────┘
       ▲                                             │
       └──── "没解决什么" 引出下一节的 "为什么" ──────────┘
```

每节还包含：
- **难度标签**：入门（绿）/ 进阶（蓝）/ 高级（紫）
- **费用标注**：预计 API 调用成本
- **前置知识**：依赖的前序章节
- **Colab 链接**：一键在云端运行 Demo（需推送到 GitHub 后生效）

---

## 三种学习路径

### 速成路径（7 节 / 约 3 小时）

快速跑通 AI 开发全流程：

```
1.1 第一次AI对话 → 4.1 Prompt基础 → 5.1 IDE工具
→ 7.1 Function Calling → 9.2 ReAct Agent → 12.1 RAG基础
→ 14.1 知识库实战
```

### 角色路径

| 角色 | 推荐章节 |
|------|---------|
| 后端开发者 | Ch1 → Ch3 → Ch4 → Ch7 → Ch9 → Ch12 → Ch13 → Ch14.1 |
| 前端开发者 | Ch1 → Ch4 → Ch5 → Ch6 → Ch8 → Ch14.4 |
| 运维 / SRE | Ch1 → Ch4 → Ch5 → Ch9 → Ch11 → Ch13 → Ch14.3 |
| 技术管理者 | Ch1 → Ch5 → Ch6.4 → Ch11.4 → Ch13.4 → Ch14.4 |

### 完整路径

14 章 46 节按顺序学完，从入门到精通。

---

## 项目结构

```
ai-first-app/
├── docs/                              # VitePress 文档源码
│   ├── .vitepress/
│   │   ├── config.ts                  # 站点配置（导航、侧边栏、搜索）
│   │   └── theme/
│   │       ├── index.ts               # 主题入口（注册全局组件）
│   │       └── components/
│   │           ├── ColabBadge.vue      # Colab / 本地运行指引
│   │           ├── DifficultyBadge.vue # 难度标签（入门/进阶/高级）
│   │           └── CostBadge.vue       # API 费用标注
│   ├── index.md                       # 首页（学习路线图 + 三种路径）
│   ├── 01-first-experience/           # 第1章：3 分钟体验 AI
│   ├── 02-ai-landscape/              # 第2章：AI 全景与模型平台
│   ├── 03-llm-fundamentals/          # 第3章：LLM 核心原理
│   ├── 04-prompt-engineering/         # 第4章：Prompt Engineering
│   ├── 05-ai-coding-tools/           # 第5章：AI 编程工具全景
│   ├── 06-context-engineering/        # 第6章：Context Engineering
│   ├── 07-function-calling/           # 第7章：Function Calling & Tool Use
│   ├── 08-multimodal/                # 第8章：多模态 AI
│   ├── 09-ai-agents/                 # 第9章：AI Agent
│   ├── 10-multi-agent/               # 第10章：Multi-Agent
│   ├── 11-protocols/                  # 第11章：MCP / A2A / ANP
│   ├── 12-rag-memory/                # 第12章：RAG & 记忆存储
│   ├── 13-production/                 # 第13章：生产化
│   ├── 14-practice/                   # 第14章：IT 部门实战场景
│   └── appendix/                      # 附录
├── demos/                             # Jupyter Notebook Demo（与章节一一对应）
├── assets/                            # 共享图片/GIF 资源
├── package.json                       # Node.js 依赖（VitePress）
└── pyproject.toml                     # Python 依赖（Demo 代码）
```

---

## 技术栈

| 层面 | 选型 | 说明 |
|------|------|------|
| 文档站点 | [VitePress](https://vitepress.dev/) v1.6 | Markdown 驱动、中文友好、Mermaid 原生支持 |
| Demo 代码 | Python 3.10+ | AI/ML 生态主流语言 |
| Notebook | Jupyter | 本地运行或 Google Colab 云端运行 |
| 图表 | Mermaid | 架构图/流程图直接写在 Markdown 中 |
| 包管理 | pnpm（站点）+ uv（Python） | 现代高效 |

> **什么是 Google Colab？**
> [Google Colab](https://colab.research.google.com/) 是 Google 提供的免费在线 Jupyter Notebook 环境。无需在本地安装任何东西，打开浏览器就能运行 Python 代码，还可以免费使用 GPU。本教程的所有 Demo Notebook 都可以在 Colab 中一键运行——前提是项目已推送到 GitHub。在推送之前，可以在本地用 `jupyter notebook demos/` 运行。

---

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Python >= 3.10（运行 Demo 用）

### 启动文档站点

```bash
# 克隆项目
git clone https://github.com/forhow134/ai-coding-guide.git
cd ai-coding-guide

# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev
# 访问 http://localhost:5173
```

### 构建静态站点

```bash
pnpm docs:build
pnpm docs:preview  # 预览构建产物
```

### 运行 Python Demo

**方式一：本地 Jupyter**

```bash
# 安装 Python 依赖
pip install openai anthropic google-genai tiktoken jupyter

# 启动 Jupyter
jupyter notebook demos/
```

**方式二：Google Colab（需先推送到 GitHub）**

1. 将项目推送到 GitHub
2. 点击每节文档中的 **Open in Colab** 按钮
3. 在 Colab 中直接运行，无需本地环境

> **配置 Colab 链接**：Colab 链接已配置为 `forhow134/ai-coding-guide`，推送到 GitHub 后即可生效。

---

## 知识覆盖范围

本教程基于 **2026 年 2 月** 的 AI 技术生态，覆盖以下领域：

| 领域 | 覆盖内容 |
|------|---------|
| LLM 基础 | Token、参数、推理模型（o3/R1）、模型选型 |
| 模型平台 | OpenAI、Claude、Gemini、DeepSeek、Qwen、Mistral |
| 聚合网关 | OpenRouter、ZenMux、Azure OpenAI、AWS Bedrock |
| 本地部署 | Ollama、LM Studio |
| Prompt 工程 | 基础技巧、Few-shot、CoT、结构化输出 |
| AI 编程工具 | Cursor、Copilot、Windsurf(Cognition)、Claude Code、Codex、Gemini CLI |
| Context 工程 | AGENTS.md、Cursor Rules、Agent Skills、Vibe Coding |
| 工具调用 | Function Calling、Tool Use、Streaming、工具编排 |
| 多模态 | Vision、Image Gen、Speech/TTS、Realtime API |
| AI Agent | ReAct、OpenAI Agents SDK、LangGraph、Computer Use |
| Multi-Agent | 协作架构、Handoff、Supervisor-Worker |
| 协议标准 | MCP、A2A、ANP |
| RAG | 向量数据库、Embedding、Reranking、Hybrid Search |
| 记忆管理 | 短期/长期记忆、对话历史、持久化 |
| 生产化 | Guardrails、评估、可观测、Prompt Caching、成本优化 |
| 实战项目 | 知识库 Q&A、Code Review、运维助手、团队工具链 |

---

## 自定义组件

文档中使用了 3 个全局 Vue 组件（仅在 VitePress 站点中渲染）：

| 组件 | 用途 | 示例 |
|------|------|------|
| `<DifficultyBadge />` | 难度标签 | `<DifficultyBadge level="beginner" />` → 入门（绿） |
| `<CostBadge />` | API 费用 | `<CostBadge cost="$0.01" />` → ~$0.01 |
| `<ColabBadge />` | 运行指引 | `<ColabBadge path="demos/01/hello.ipynb" />` |

---

## 部署

### 静态托管

```bash
pnpm docs:build
# 构建产物在 docs/.vitepress/dist/
# 部署到 GitHub Pages / Vercel / Netlify / Cloudflare Pages
```

### Docker（可选）

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install
COPY . .
RUN pnpm docs:build

FROM nginx:alpine
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
```

---

## 贡献指南

1. 在 `docs/` 下创建新目录和 Markdown 文件
2. 遵循四段式结构（Why → What → How → Reflection）
3. 在 `demos/` 下创建对应的 Jupyter Notebook
4. 更新 `docs/.vitepress/config.ts` 的侧边栏配置
5. 代码示例标注预计 API 费用，文件末尾标注更新日期

---

## License

[MIT](LICENSE)

---

> **提示**：AI 领域发展迅速，本教程基于 2026 年 2 月的技术状态。每节底部标注了最后更新时间，核心 Demo 绑定了具体的包版本号。
