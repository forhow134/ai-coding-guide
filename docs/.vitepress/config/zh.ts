import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const zh: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: 'zh-CN',
  title: 'AI 编程从入门到实战',
  description: '为 IT 部门打造的 AI 编程科普教程 — 从零到实战，问题驱动，每个概念都有可运行的 Demo',

  themeConfig: {
    siteTitle: 'AI 编程教程',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    nav: [
      { text: '首页', link: '/zh/' },
      {
        text: '入门篇',
        items: [
          { text: '第1章 3分钟体验 AI', link: '/zh/01-first-experience/' },
          { text: '第2章 AI 全景与模型平台', link: '/zh/02-ai-landscape/' },
          { text: '第3章 LLM 核心原理', link: '/zh/03-llm-fundamentals/' },
          { text: '第4章 Prompt Engineering', link: '/zh/04-prompt-engineering/' },
        ],
      },
      {
        text: '工具篇',
        items: [
          { text: '第5章 AI 编程工具全景', link: '/zh/05-ai-coding-tools/' },
          { text: '第6章 Context Engineering', link: '/zh/06-context-engineering/' },
        ],
      },
      {
        text: '能力篇',
        items: [
          { text: '第7章 Function Calling', link: '/zh/07-function-calling/' },
          { text: '第8章 多模态 AI', link: '/zh/08-multimodal/' },
          { text: '第9章 AI Agent', link: '/zh/09-ai-agents/' },
          { text: '第10章 Multi-Agent', link: '/zh/10-multi-agent/' },
        ],
      },
      {
        text: '生态篇',
        items: [
          { text: '第11章 MCP / A2A / ANP', link: '/zh/11-protocols/' },
          { text: '第12章 RAG & 记忆存储', link: '/zh/12-rag-memory/' },
        ],
      },
      {
        text: '生产篇',
        items: [
          { text: '第13章 生产化', link: '/zh/13-production/' },
        ],
      },
      {
        text: '实战篇',
        items: [
          { text: '第14章 IT 部门实战', link: '/zh/14-practice/' },
          { text: '第15章 AI Workflow 平台', link: '/zh/15-ai-workflow/' },
          { text: '第16章 AI 赋能非开发者', link: '/zh/16-ai-for-everyone/' },
        ],
      },
      { text: '附录', link: '/zh/appendix/' },
    ],

    sidebar: {
      '/zh/01-first-experience/': [{ text: '第一篇：入门篇', items: [{ text: '第1章 3 分钟体验 AI', collapsed: false, items: [{ text: '1.1 你的第一次 AI 对话', link: '/zh/01-first-experience/' }, { text: '1.2 免费方案与零成本起步', link: '/zh/01-first-experience/free-options' }] }] }],
      '/zh/02-ai-landscape/': [{ text: '第一篇：入门篇', items: [{ text: '第2章 AI 全景与模型平台', collapsed: false, items: [{ text: '2.1 AI 全景图', link: '/zh/02-ai-landscape/' }, { text: '2.2 主流模型提供商', link: '/zh/02-ai-landscape/model-providers' }, { text: '2.3 聚合平台与网关', link: '/zh/02-ai-landscape/aggregators' }, { text: '2.4 本地模型部署', link: '/zh/02-ai-landscape/local-deployment' }, { text: '2.5 开源推理模型大盘点', link: '/zh/02-ai-landscape/open-source-models' }, { text: '2.6 AI 简史：从图灵到 GPT-5', link: '/zh/02-ai-landscape/ai-timeline' }] }] }],
      '/zh/03-llm-fundamentals/': [{ text: '第一篇：入门篇', items: [{ text: '第3章 LLM 核心原理', collapsed: false, items: [{ text: '3.1 Token 与分词', link: '/zh/03-llm-fundamentals/' }, { text: '3.2 推理参数详解', link: '/zh/03-llm-fundamentals/parameters' }, { text: '3.3 推理模型与思考链', link: '/zh/03-llm-fundamentals/reasoning-models' }, { text: '3.4 Fine-tuning 与模型蒸馏', link: '/zh/03-llm-fundamentals/fine-tuning' }] }] }],
      '/zh/04-prompt-engineering/': [{ text: '第一篇：入门篇', items: [{ text: '第4章 Prompt Engineering', collapsed: false, items: [{ text: '4.1 Prompt 基础', link: '/zh/04-prompt-engineering/' }, { text: '4.2 进阶技巧', link: '/zh/04-prompt-engineering/advanced-techniques' }, { text: '4.3 结构化输出', link: '/zh/04-prompt-engineering/structured-output' }] }] }],
      '/zh/05-ai-coding-tools/': [{ text: '第二篇：工具篇', items: [{ text: '第5章 AI 编程工具全景', collapsed: false, items: [{ text: '5.1 IDE 集成型工具', link: '/zh/05-ai-coding-tools/' }, { text: '5.2 终端原生工具', link: '/zh/05-ai-coding-tools/terminal-tools' }, { text: '5.3 云端 AI 开发', link: '/zh/05-ai-coding-tools/cloud-ai' }, { text: '5.4 工具选型指南', link: '/zh/05-ai-coding-tools/selection-guide' }, { text: '5.5 个人 AI 代理 (OpenClaw)', link: '/zh/05-ai-coding-tools/personal-agents' }, { text: '5.6 AI 辅助测试工具', link: '/zh/05-ai-coding-tools/testing-tools' }, { text: '5.7 AI 搜索引擎与研究工具', link: '/zh/05-ai-coding-tools/ai-search' }] }] }],
      '/zh/06-context-engineering/': [{ text: '第二篇：工具篇', items: [{ text: '第6章 Context Engineering', collapsed: false, items: [{ text: '6.1 Context Engineering 概念', link: '/zh/06-context-engineering/' }, { text: '6.2 AGENTS.md 标准', link: '/zh/06-context-engineering/agents-md' }, { text: '6.3 Rules & Skills 体系', link: '/zh/06-context-engineering/rules-skills' }, { text: '6.4 Vibe Coding 与 AI-First 开发流', link: '/zh/06-context-engineering/vibe-coding' }, { text: '6.5 Ralph Wiggum 模式', link: '/zh/06-context-engineering/ralph-pattern' }] }] }],
      '/zh/07-function-calling/': [{ text: '第三篇：能力篇', items: [{ text: '第7章 Function Calling & Tool Use', collapsed: false, items: [{ text: '7.1 Function Calling 原理', link: '/zh/07-function-calling/' }, { text: '7.2 Tool Use 实战', link: '/zh/07-function-calling/tool-use' }, { text: '7.3 工具编排与回退', link: '/zh/07-function-calling/orchestration' }] }] }],
      '/zh/08-multimodal/': [{ text: '第三篇：能力篇', items: [{ text: '第8章 多模态 AI', collapsed: false, items: [{ text: '8.1 Vision（图像理解）', link: '/zh/08-multimodal/' }, { text: '8.2 Image Generation', link: '/zh/08-multimodal/image-generation' }, { text: '8.3 Speech & Audio', link: '/zh/08-multimodal/speech-audio' }, { text: '8.4 Video & Realtime', link: '/zh/08-multimodal/video-realtime' }, { text: '8.5 多模态应用实战', link: '/zh/08-multimodal/multimodal-practice' }] }] }],
      '/zh/09-ai-agents/': [{ text: '第三篇：能力篇', items: [{ text: '第9章 AI Agent', collapsed: false, items: [{ text: '9.1 Agent 核心概念', link: '/zh/09-ai-agents/' }, { text: '9.2 ReAct 模式', link: '/zh/09-ai-agents/react' }, { text: '9.3 Agent 框架实战', link: '/zh/09-ai-agents/frameworks' }, { text: '9.4 Computer Use', link: '/zh/09-ai-agents/computer-use' }, { text: '9.5 AI-Native 开发模式', link: '/zh/09-ai-agents/ai-native-dev' }, { text: '9.6 Browser Use & Web Agent', link: '/zh/09-ai-agents/browser-use' }] }] }],
      '/zh/10-multi-agent/': [{ text: '第三篇：能力篇', items: [{ text: '第10章 Multi-Agent', collapsed: false, items: [{ text: '10.1 多 Agent 架构', link: '/zh/10-multi-agent/' }, { text: '10.2 Sub-Agent 与 Handoff', link: '/zh/10-multi-agent/handoff' }, { text: '10.3 实战：多 Agent 研究系统', link: '/zh/10-multi-agent/research-system' }] }] }],
      '/zh/11-protocols/': [{ text: '第四篇：生态篇', items: [{ text: '第11章 MCP / A2A / ANP', collapsed: false, items: [{ text: '11.1 MCP 协议详解', link: '/zh/11-protocols/' }, { text: '11.2 A2A 协议', link: '/zh/11-protocols/a2a' }, { text: '11.3 ANP 协议', link: '/zh/11-protocols/anp' }, { text: '11.4 协议生态全景', link: '/zh/11-protocols/ecosystem' }, { text: '11.5 AG-UI 协议', link: '/zh/11-protocols/ag-ui' }, { text: '11.6 协议融合趋势', link: '/zh/11-protocols/convergence' }] }] }],
      '/zh/12-rag-memory/': [{ text: '第四篇：生态篇', items: [{ text: '第12章 RAG & 记忆存储', collapsed: false, items: [{ text: '12.1 RAG 基础', link: '/zh/12-rag-memory/' }, { text: '12.2 Embedding & 向量数据库', link: '/zh/12-rag-memory/embeddings' }, { text: '12.3 高级 RAG', link: '/zh/12-rag-memory/advanced-rag' }, { text: '12.4 Memory & Storage', link: '/zh/12-rag-memory/memory' }, { text: '12.5 GraphRAG', link: '/zh/12-rag-memory/graph-rag' }, { text: '12.6 Agentic RAG', link: '/zh/12-rag-memory/agentic-rag' }, { text: '12.7 AI Memory 产品全景', link: '/zh/12-rag-memory/memory-products' }] }] }],
      '/zh/13-production/': [{ text: '第五篇：生产篇', items: [{ text: '第13章 生产化', collapsed: false, items: [{ text: '13.1 Guardrails（护栏）', link: '/zh/13-production/' }, { text: '13.2 Evaluation（评估）', link: '/zh/13-production/evaluation' }, { text: '13.3 Observability（可观测）', link: '/zh/13-production/observability' }, { text: '13.4 成本优化与安全', link: '/zh/13-production/cost-security' }, { text: '13.5 AI 安全与合规', link: '/zh/13-production/safety-compliance' }, { text: '13.6 AI 法规与全球治理', link: '/zh/13-production/regulations' }] }] }],
      '/zh/14-practice/': [{ text: '第六篇：实战篇', items: [{ text: '第14章 IT 部门实战场景', collapsed: false, items: [{ text: '14.1 内部知识库 Q&A 系统', link: '/zh/14-practice/' }, { text: '14.2 AI Code Review 助手', link: '/zh/14-practice/code-review' }, { text: '14.3 IT 运维智能助手', link: '/zh/14-practice/ops-assistant' }, { text: '14.4 团队 AI 工具链搭建', link: '/zh/14-practice/team-toolchain' }, { text: '14.5 AI 辅助数据分析', link: '/zh/14-practice/data-analysis' }, { text: '14.6 AI 驱动的文档与知识管理', link: '/zh/14-practice/doc-management' }] }] }],
      '/zh/15-ai-workflow/': [{ text: '拓展篇：AI 编排平台', items: [{ text: '第15章 AI Workflow 与自动化平台', collapsed: false, items: [{ text: '15.1 AI 编排平台全景', link: '/zh/15-ai-workflow/' }, { text: '15.2 主流平台详解', link: '/zh/15-ai-workflow/platforms' }] }] }],
      '/zh/16-ai-for-everyone/': [{ text: '拓展篇：AI 赋能非开发者', items: [{ text: '第16章 AI 赋能非开发者', collapsed: false, items: [{ text: '16.1 人人都是开发者', link: '/zh/16-ai-for-everyone/' }] }] }],
      '/zh/appendix/': [{ text: '附录', items: [{ text: 'A. 术语表', link: '/zh/appendix/' }, { text: 'B. 技术雷达', link: '/zh/appendix/tech-radar' }, { text: 'C. 资源索引', link: '/zh/appendix/resources' }, { text: 'D. FAQ', link: '/zh/appendix/faq' }, { text: 'E. 2026 年度热词', link: '/zh/appendix/buzzwords-2026' }, { text: 'F. 学习路线图', link: '/zh/appendix/learning-paths' }] }],
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    lastUpdated: {
      text: '最后更新',
    },

    docFooter: {
      prev: '上一节',
      next: '下一节',
    },

    footer: {
      message: '为 IT 部门打造的 AI 编程科普教程',
      copyright: 'MIT License',
    },
  },
}
