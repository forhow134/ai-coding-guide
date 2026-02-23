# AI Coding Guide — From Zero to Production

> A comprehensive, hands-on AI programming tutorial for IT teams — covering LLM fundamentals, prompt engineering, AI agents, RAG, and production-grade AI application development.

**[Chinese Version / 中文版](README_ZH.md)**

[![VitePress](https://img.shields.io/badge/VitePress-1.6-646CFF?logo=vitepress)](https://vitepress.dev/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)](https://python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?logo=jupyter)](https://jupyter.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## What Is This?

An **open-source AI programming knowledge base** designed for IT professionals who want to learn AI development from scratch. Built with VitePress + Jupyter Notebooks, it covers everything from your first API call to deploying production AI agents.

**Key Features:**

- **Learn by Doing** — Every concept comes with runnable code (Jupyter Notebooks on Google Colab)
- **Problem-Driven** — Each section starts with a real-world problem you'll face at work
- **Multiple Learning Paths** — Quick-start (3 hours), role-based, or full curriculum
- **Updated for 2026** — Covers GPT-5, Claude 4.6, DeepSeek R1, OpenClaw, MCP protocol, and more

## Content Overview

| Part | Chapters | Topics |
|------|----------|--------|
| **Getting Started** | Ch1–Ch4 | First AI conversation, AI landscape & model providers, LLM fundamentals (tokens, parameters, reasoning models), Prompt engineering (CoT, structured output) |
| **Tools** | Ch5–Ch6 | AI coding tools (Cursor, Copilot, Claude Code, Windsurf, Codex CLI), Context engineering (AGENTS.md, Rules, Vibe Coding) |
| **Capabilities** | Ch7–Ch10 | Function calling & tool use, Multimodal AI (vision, image generation, speech, Realtime API), AI agents (ReAct, OpenAI Agents SDK, LangGraph), Multi-agent systems (handoff, supervisor-worker) |
| **Ecosystem** | Ch11–Ch12 | AI protocols (MCP, A2A, ANP), RAG & memory (vector search, hybrid retrieval, reranking) |
| **Production** | Ch13–Ch14 | Guardrails, evaluation, observability, cost optimization, IT practice projects (knowledge base Q&A, code review bot, ops assistant) |
| **Extensions** | Ch15–Ch16 | AI workflow platforms (Dify, Coze, n8n), AI for non-developers |

**Scale:** 16 chapters, 60+ sections, 55 Markdown docs, 39 Jupyter Notebooks

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Documentation | [VitePress](https://vitepress.dev/) v1.6 | Markdown-driven, fast, great i18n support |
| Code Demos | Python 3.10+ / Jupyter | Standard AI/ML ecosystem |
| Diagrams | Mermaid | Architecture & flow charts inline in Markdown |
| Package Managers | pnpm (site) + uv (Python) | Modern & efficient |

## Quick Start

### Run the Documentation Site

```bash
git clone https://github.com/forhow134/ai-coding-guide.git
cd ai-coding-guide

# Install dependencies
pnpm install

# Start dev server
pnpm docs:dev
# Visit http://localhost:5173
```

Or use the management script:

```bash
./start.sh dev          # Start dev server (hot reload)
./start.sh build        # Build static site
./start.sh preview      # Preview build output
./start.sh stop         # Stop server
```

### Run Python Demos

**Option 1: Google Colab (Recommended)**

Click the **"Open in Colab"** badge in any chapter — runs in browser, no local setup needed.

**Option 2: Local Jupyter**

```bash
pip install openai anthropic google-genai tiktoken jupyter
jupyter notebook demos/
```

### Deploy with Containers

```bash
./start.sh docker-build    # Build image (auto-detects podman/docker)
./start.sh docker-run      # Run container at localhost:8080
./start.sh docker-stop     # Stop container
```

### Deploy to Kubernetes

```bash
./start.sh docker-build
./start.sh k8s-deploy                   # Auto-generates manifests
K8S_NAMESPACE=prod ./start.sh k8s-deploy # Target specific namespace
```

## Learning Paths

### Speed Run (7 sections / ~3 hours)

```
1.1 First AI Chat → 4.1 Prompt Basics → 5.1 IDE Tools
→ 7.1 Function Calling → 9.2 ReAct Agent → 12.1 RAG Basics
→ 14.1 Knowledge Base Project
```

### By Role

| Role | Recommended Path |
|------|-----------------|
| Backend Developer | Ch1 → Ch3 → Ch4 → Ch7 → Ch9 → Ch12 → Ch13 → Ch14.1 |
| Frontend Developer | Ch1 → Ch4 → Ch5 → Ch6 → Ch8 → Ch14.4 |
| DevOps / SRE | Ch1 → Ch4 → Ch5 → Ch9 → Ch11 → Ch13 → Ch14.3 |
| Tech Lead / Manager | Ch1 → Ch5 → Ch6 → Ch11 → Ch13 → Ch14.4 |

### Full Curriculum

All 16 chapters in order — from beginner to production-ready.

## Topics Covered

| Area | Details |
|------|---------|
| **LLM Fundamentals** | Tokens, parameters, temperature, reasoning models (o3, DeepSeek R1), model selection |
| **Model Providers** | OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Qwen, Mistral, xAI Grok |
| **API Gateways** | OpenRouter, ZenMux, Azure OpenAI, AWS Bedrock |
| **Local Deployment** | Ollama, LM Studio, open-source models |
| **Prompt Engineering** | Zero-shot, few-shot, chain-of-thought (CoT), structured output, advanced techniques |
| **AI Coding Tools** | Cursor, GitHub Copilot, Windsurf, Claude Code, OpenAI Codex CLI, Gemini CLI |
| **Context Engineering** | AGENTS.md, project rules, cursor rules, vibe coding |
| **Function Calling** | OpenAI function calling, Anthropic tool use, streaming, tool orchestration |
| **Multimodal AI** | GPT-4 Vision, DALL-E 3, Stable Diffusion, text-to-speech, Realtime API |
| **AI Agents** | ReAct pattern, OpenAI Agents SDK, LangGraph, computer use |
| **Multi-Agent** | Sequential, parallel, hierarchical architectures, Swarm, handoff patterns |
| **AI Protocols** | MCP (Model Context Protocol), A2A (Agent-to-Agent), ANP (Agent Network Protocol), AG-UI |
| **RAG** | Vector databases (ChromaDB), embedding, chunking, reranking, hybrid search, agentic RAG |
| **Memory** | Short-term / long-term memory, conversation history, persistence |
| **Production** | Guardrails, LLM evaluation, observability, prompt caching, cost optimization |
| **Practice Projects** | Knowledge base Q&A, AI code review, ops assistant, team toolchain |
| **AI Workflow** | Dify, Coze, n8n, Flowise — no-code/low-code AI app builders |
| **AI History** | From Turing Test (1950) to Transformer (2017) to ChatGPT (2022) to GPT-5 (2025) |

## Contributing

1. Create a new directory and Markdown files under `docs/`
2. Follow the four-part structure: **Why → What → How → Reflection**
3. Add corresponding Jupyter Notebooks under `demos/`
4. Update sidebar config in `docs/.vitepress/config/`
5. Mark API cost estimates and last-updated dates

## License

[MIT](LICENSE)

---

> **Note:** AI evolves fast. This tutorial reflects the state of AI technology as of **February 2026**. Each section includes a last-updated timestamp, and core demos are pinned to specific package versions.
