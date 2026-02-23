#!/usr/bin/env python3
"""Batch convert notebooks to bilingual (English-primary) format.

For each notebook:
- Markdown cells: Add English translation above Chinese text
- Code cells: Add English comments above Chinese comments
- Colab badge URLs: Fix OWNER/REPO placeholders
"""

import json
import os
import re
import glob

REPO = "forhow134/ai-coding-guide"

ZH_TO_EN = {
    "预计 API 费用": "Estimated API Cost",
    "本 Notebook 演示": "This notebook demonstrates",
    "实验": "Experiment",
    "动手练习": "Hands-on Exercises",
    "关键要点总结": "Key Takeaways",
    "下一步": "Next Step",
    "环境准备": "Environment Setup",
    "安装依赖": "Install Dependencies",
    "基础": "Basics",
    "进阶": "Advanced",
    "实战": "Practice",
    "小结": "Summary",
    "对比": "Comparison",
    "原理": "Principles",
    "概念": "Concepts",
    "工具": "Tools",
    "参数": "Parameters",
    "模型": "Models",
    "配置": "Configuration",
    "测试": "Test",
    "运行": "Run",
    "结果": "Results",
    "分析": "Analysis",
    "示例": "Example",
    "完整代码": "Complete Code",
    "输出": "Output",
    "定义": "Define",
    "调用": "Call",
    "查询": "Query",
    "搜索": "Search",
    "生成": "Generate",
    "评估": "Evaluate",
    "部署": "Deploy",
    "监控": "Monitor",
    "优化": "Optimize",
    "成本": "Cost",
    "安全": "Security",
    "记忆": "Memory",
    "向量": "Vector",
    "文档": "Document",
    "对话": "Conversation",
    "语音": "Speech",
    "图像": "Image",
    "视频": "Video",
    "流式": "Streaming",
    "多轮": "Multi-turn",
    "编排": "Orchestration",
    "护栏": "Guardrails",
    "可观测性": "Observability",
}

TITLE_MAP = {
    "1.1 你的第一次 AI 对话": "1.1 Your First AI Conversation",
    "1.2 免费方案": "1.2 Free Options",
    "2.2 主流模型提供商": "2.2 Major Model Providers",
    "2.3 聚合平台与网关": "2.3 Aggregator Platforms & Gateways",
    "2.4 本地模型部署": "2.4 Local Model Deployment",
    "3.1 Token 与分词实验": "3.1 Token & Tokenization Lab",
    "3.2 参数调节实验": "3.2 Parameter Tuning Lab",
    "3.3 推理模型实验": "3.3 Reasoning Models Lab",
    "4.1 Prompt 基础技巧实验": "4.1 Prompt Basics Lab",
    "4.2 高级 Prompt 技巧": "4.2 Advanced Prompt Techniques",
    "4.3 结构化输出实验": "4.3 Structured Output Lab",
    "7.1 Function Calling 原理实验": "7.1 Function Calling Lab",
    "7.2 Tool Use 实战": "7.2 Tool Use in Practice",
    "7.3 工具编排实验": "7.3 Tool Orchestration Lab",
    "8.1 Vision 多模态实验": "8.1 Vision & Multimodal Lab",
    "8.2 图像生成实验": "8.2 Image Generation Lab",
    "8.3 语音与音频实验": "8.3 Speech & Audio Lab",
    "8.4 实时语音对话": "8.4 Realtime Voice Conversation",
    "9.1 AI Agent 概念与基础": "9.1 AI Agent Concepts & Basics",
    "9.2 手写 ReAct Agent": "9.2 Build a ReAct Agent from Scratch",
    "9.3 Agent 框架对比": "9.3 Agent Framework Comparison",
    "9.4 Computer Use 实验": "9.4 Computer Use Lab",
    "10.1 多 Agent 协作架构": "10.1 Multi-Agent Collaboration Architectures",
    "10.2 Handoff 与 Agent 委托": "10.2 Handoff & Agent Delegation",
    "10.3 深度研究系统": "10.3 Deep Research System",
    "11.1 MCP 协议概览": "11.1 MCP Protocol Overview",
    "11.2 MCP Server 开发实战": "11.2 Building an MCP Server",
    "12.1 基础 RAG 实现": "12.1 Basic RAG Implementation",
    "12.2 向量搜索深入": "12.2 Vector Search Deep Dive",
    "12.3 高级 RAG 技巧": "12.3 Advanced RAG Techniques",
    "12.4 记忆与对话机器人": "12.4 Memory & Chatbot",
    "13.1 护栏与安全实验": "13.1 Guardrails & Safety Lab",
    "13.2 LLM 评估实验": "13.2 LLM Evaluation Lab",
    "13.3 可观测性实践": "13.3 Observability in Practice",
    "13.4 成本优化实验": "13.4 Cost Optimization Lab",
    "14.1 知识库 Q&A 系统": "14.1 Knowledge Base Q&A System",
    "14.2 AI Code Review 助手": "14.2 AI Code Review Assistant",
    "14.3 智能运维助手": "14.3 Smart Ops Assistant",
    "14.4 团队 AI 工具链": "14.4 Team AI Toolchain",
}

COMMENT_PATTERNS = [
    (r"# 定义工具", "# Define tools"),
    (r"# 实现工具函数", "# Implement tool functions"),
    (r"# 测试", "# Test"),
    (r"# 模拟", "# Mock/Simulate"),
    (r"# 执行工具", "# Execute tool"),
    (r"# 将结果返回", "# Return results to"),
    (r"# 工具路由", "# Tool routing"),
    (r"# 安装依赖", "# Install dependencies"),
    (r"# 配置", "# Configure"),
    (r"# 初始化", "# Initialize"),
    (r"# 创建", "# Create"),
    (r"# 查询", "# Query"),
    (r"# 搜索", "# Search"),
    (r"# 生成", "# Generate"),
    (r"# 返回", "# Return"),
    (r"# 输出", "# Output"),
    (r"# 解析", "# Parse"),
    (r"# 验证", "# Validate"),
    (r"# 处理", "# Process"),
    (r"# 加载", "# Load"),
    (r"# 保存", "# Save"),
    (r"# 清理", "# Clean up"),
    (r"# 运行", "# Run"),
    (r"# 启动", "# Start"),
    (r"# 停止", "# Stop"),
    (r"# 设置", "# Setup"),
    (r"请输入你的 OpenAI API Key", "Enter your OpenAI API Key"),
    (r"请输入你的 API Key", "Enter your API Key"),
]


def fix_colab_url(text):
    text = text.replace("your-org/ai-first-app", REPO)
    text = text.replace("OWNER/REPO", REPO)
    return text


def make_bilingual_markdown(source):
    lines = source.split("\n")
    result = []
    for line in lines:
        line = fix_colab_url(line)
        if line.startswith("# ") and any('\u4e00' <= c <= '\u9fff' for c in line):
            zh_title = line[2:].strip()
            en_title = None
            for zh, en in TITLE_MAP.items():
                if zh in zh_title:
                    en_title = en
                    break
            if en_title:
                result.append(f"# {en_title}")
                result.append(f"# {zh_title}")
            else:
                result.append(line)
        elif line.startswith("## ") and any('\u4e00' <= c <= '\u9fff' for c in line):
            zh_part = line[3:].strip()
            en_part = zh_part
            for zh, en in TITLE_MAP.items():
                if zh in zh_part:
                    en_part = en
                    break
            if en_part == zh_part:
                num_match = re.match(r'^(实验\s*\d+)\s*[:：]\s*(.*)', zh_part)
                if num_match:
                    exp_num = num_match.group(1).replace("实验", "Experiment")
                    rest = num_match.group(2)
                    for zh_k, en_k in ZH_TO_EN.items():
                        rest = rest.replace(zh_k, en_k)
                    en_part = f"{exp_num}: {rest}"
                else:
                    for zh_k, en_k in ZH_TO_EN.items():
                        en_part = en_part.replace(zh_k, en_k)
            if en_part != zh_part:
                result.append(f"## {en_part}")
                result.append(f"<!-- {zh_part} -->")
            else:
                result.append(line)
        else:
            result.append(line)
    return "\n".join(result)


def make_bilingual_code(source):
    source = fix_colab_url(source)
    for zh_pat, en_pat in COMMENT_PATTERNS:
        source = re.sub(zh_pat, en_pat, source)
    return source


def process_notebook(path):
    with open(path, "r", encoding="utf-8") as f:
        nb = json.load(f)

    changed = False
    for cell in nb.get("cells", []):
        if cell["cell_type"] == "markdown":
            old = "".join(cell["source"])
            new = make_bilingual_markdown(old)
            if old != new:
                cell["source"] = [line + "\n" for line in new.split("\n")]
                if cell["source"]:
                    cell["source"][-1] = cell["source"][-1].rstrip("\n")
                changed = True
        elif cell["cell_type"] == "code":
            old = "".join(cell["source"])
            new = make_bilingual_code(old)
            if old != new:
                cell["source"] = [line + "\n" for line in new.split("\n")]
                if cell["source"]:
                    cell["source"][-1] = cell["source"][-1].rstrip("\n")
                changed = True

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(nb, f, ensure_ascii=False, indent=1)
        return True
    return False


def main():
    notebooks = sorted(glob.glob("demos/**/*.ipynb", recursive=True))
    print(f"Found {len(notebooks)} notebooks")

    updated = 0
    errors = []
    for nb_path in notebooks:
        try:
            if process_notebook(nb_path):
                updated += 1
                print(f"  [OK] {nb_path}")
            else:
                print(f"  [--] {nb_path} (no changes)")
        except (json.JSONDecodeError, KeyError) as e:
            errors.append(nb_path)
            print(f"  [ERR] {nb_path}: {e}")

    print(f"\nDone: {updated}/{len(notebooks)} notebooks updated")
    if errors:
        print(f"Errors ({len(errors)} files with invalid JSON):")
        for e in errors:
            print(f"  - {e}")


if __name__ == "__main__":
    main()
