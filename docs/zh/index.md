---
layout: home
hero:
  name: AI 编程从入门到实战
  text: 为 IT 部门打造的 AI 编程科普教程
  tagline: 先体验，再理解 · 问题驱动 · 每个概念都有可运行的 Demo
  actions:
    - theme: brand
      text: 3 分钟体验 AI →
      link: /zh/01-first-experience/
    - theme: alt
      text: 速成路径（7 节 / 3 小时）
      link: /zh/01-first-experience/#速成路径
features:
  - icon: 🚀
    title: 第一篇：入门篇
    details: 3 行代码调通 AI，理解核心原理，掌握 Prompt 技巧
    link: /zh/01-first-experience/
  - icon: 🛠️
    title: 第二篇：工具篇
    details: AI 编程工具全景（含测试 & 搜索）、AGENTS.md、Context Engineering
    link: /zh/05-ai-coding-tools/
  - icon: ⚡
    title: 第三篇：能力篇
    details: Function Calling、多模态实战、AI Agent、Browser Use、Multi-Agent
    link: /zh/07-function-calling/
  - icon: 🌐
    title: 第四篇：生态篇
    details: MCP / A2A / AG-UI 协议，RAG、Agentic RAG、AI Memory
    link: /zh/11-protocols/
  - icon: 🏭
    title: 第五篇：生产篇
    details: Guardrails、评估、可观测、成本优化、AI 法规与治理
    link: /zh/13-production/
  - icon: 💼
    title: 第六篇：实战篇
    details: 知识库、Code Review、运维助手、数据分析、AI Workflow、AI 赋能全员
    link: /zh/14-practice/
---

## 学习路线图

```mermaid
graph TD
    subgraph "入门篇"
        A0["1. 3分钟体验AI"]
        A1["2. AI全景与模型平台"]
        A2["3. LLM核心原理"]
        A3["4. Prompt Engineering"]
    end

    subgraph "工具篇"
        B1["5. AI编程工具全景"]
        B2["6. Context Engineering"]
    end

    subgraph "能力篇"
        C1["7. Function Calling"]
        C2["8. 多模态AI"]
        C3["9. AI Agent"]
        C4["10. Multi-Agent"]
    end

    subgraph "生态篇"
        D1["11. MCP/A2A/AG-UI"]
        D2["12. RAG & AI Memory"]
    end

    subgraph "生产篇"
        E1["13. 生产化与合规"]
    end

    subgraph "实战篇"
        F1["14. IT实战场景"]
        F2["15. AI Workflow平台"]
        F3["16. AI赋能非开发者"]
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
    F1 --> F2 --> F3

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
    style F2 fill:#c8e6c9
    style F3 fill:#c8e6c9
```

## 三种学习路径

### ⚡ 速成路径（7 节，约 3 小时） {#速成路径}

快速跑通 AI 开发全流程，适合时间有限想快速上手的同事：

**1.1 第一次AI对话** → **4.1 Prompt基础** → **5.1 IDE工具** → **7.1 Function Calling** → **9.2 ReAct Agent** → **12.1 RAG基础** → **14.1 知识库实战**

### 🎯 角色路径

按你的岗位选择重点章节：

<RolePaths />

### 📚 完整路径

16 章 60+ 节全部学完，从入门到精通。按章节顺序阅读即可。也可参考 [附录 F. 学习路线图](/zh/appendix/learning-paths) 按角色定制学习路径。

---

::: info 关于本教程
本教程基于 **2026 年 2 月** 的 AI 技术生态编写。AI 领域发展迅速，部分内容可能随版本更新而变化。每节底部标注了最后更新时间，核心 Demo 绑定了具体的包版本号。
:::
