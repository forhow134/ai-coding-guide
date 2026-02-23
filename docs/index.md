---
layout: home
hero:
  name: "AI Coding: From Zero to Production"
  text: An AI Coding Guide for IT Teams
  tagline: "Experience First, Understand Later · Problem-Driven · Every Concept Has a Runnable Demo"
  actions:
    - theme: brand
      text: "Experience AI in 3 Minutes →"
      link: /01-first-experience/
    - theme: alt
      text: "Fast Track (7 Lessons / 3 Hours)"
      link: /01-first-experience/#fast-track
features:
  - icon: 🚀
    title: "Part 1: Getting Started"
    details: "3 lines of code to call AI, understand core principles, master Prompt techniques"
    link: /01-first-experience/
  - icon: 🛠️
    title: "Part 2: Tools"
    details: "AI coding tools landscape, AGENTS.md, Context Engineering"
    link: /05-ai-coding-tools/
  - icon: ⚡
    title: "Part 3: Capabilities"
    details: "Function Calling, Multimodal, AI Agent, Multi-Agent"
    link: /07-function-calling/
  - icon: 🌐
    title: "Part 4: Ecosystem"
    details: "MCP / A2A / ANP protocols, RAG & Vector Databases"
    link: /11-protocols/
  - icon: 🏭
    title: "Part 5: Production"
    details: "Guardrails, Evaluation, Observability, Cost Optimization"
    link: /13-production/
  - icon: 💼
    title: "Part 6: Practice"
    details: "Knowledge Base Q&A, Code Review Assistant, Ops Assistant"
    link: /14-practice/
---

## Learning Roadmap

```mermaid
graph TD
    subgraph "Getting Started"
        A0["1. Experience AI in 3 Minutes"]
        A1["2. AI Landscape & Model Platforms"]
        A2["3. LLM Core Principles"]
        A3["4. Prompt Engineering"]
    end

    subgraph "Tools"
        B1["5. AI Coding Tools Overview"]
        B2["6. Context Engineering"]
    end

    subgraph "Capabilities"
        C1["7. Function Calling"]
        C2["8. Multimodal AI"]
        C3["9. AI Agent"]
        C4["10. Multi-Agent"]
    end

    subgraph "Ecosystem"
        D1["11. MCP/A2A/ANP"]
        D2["12. RAG & Memory"]
    end

    subgraph "Production"
        E1["13. Production Deployment"]
    end

    subgraph "Practice"
        F1["14. IT Practice Scenarios"]
    end

    A0 --> A1 --> A2 --> A3
    A3 --> B1 --> B2
    B2 --> C1
    C1 --> C2
    C1 --> C3 --> C4
    C3 --> D1
    C1 --> D2
    C4 --> E1
    D1 --> E1
    D2 --> E1
    E1 --> F1

    style A0 fill:#c8e6c9
    style A1 fill:#e1f5fe
    style A2 fill:#e1f5fe
    style A3 fill:#e1f5fe
    style B1 fill:#fff3e0
    style B2 fill:#fff3e0
    style C1 fill:#e8eaf6
    style C2 fill:#e8eaf6
    style C3 fill:#e8eaf6
    style C4 fill:#e8eaf6
    style D1 fill:#f3e5f5
    style D2 fill:#f3e5f5
    style E1 fill:#fce4ec
    style F1 fill:#c8e6c9
```

## Three Learning Paths

### ⚡ Fast Track (7 Lessons, ~3 Hours) {#fast-track}

Quickly run through the entire AI development workflow, suitable for colleagues with limited time who want to get started quickly:

**1.1 First AI Conversation** → **4.1 Prompt Basics** → **5.1 IDE Tools** → **7.1 Function Calling** → **9.2 ReAct Agent** → **12.1 RAG Basics** → **14.1 Knowledge Base Practice**

### 🎯 Role-Based Paths

Choose key chapters based on your role:

<RolePaths />

### 📚 Complete Path

Complete all 14 chapters and 46 sections, from beginner to expert. Read in chapter order.

---

::: info About This Guide
This guide is based on the AI technology ecosystem as of **February 2026**. The AI field evolves rapidly, and some content may change with version updates. Each section is marked with the last update date, and core demos are tied to specific package versions.
:::
