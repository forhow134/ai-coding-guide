import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const en: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: 'en',
  title: 'AI Coding: From Zero to Production',
  description: 'An AI coding guide for IT teams — from zero to production, problem-driven, every concept has a runnable demo',

  themeConfig: {
    siteTitle: 'AI Coding Guide',

    search: {
      provider: 'local',
    },

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Getting Started',
        items: [
          { text: 'Ch 1: Experience AI in 3 Minutes', link: '/01-first-experience/' },
          { text: 'Ch 2: AI Landscape & Platforms', link: '/02-ai-landscape/' },
          { text: 'Ch 3: LLM Fundamentals', link: '/03-llm-fundamentals/' },
          { text: 'Ch 4: Prompt Engineering', link: '/04-prompt-engineering/' },
        ],
      },
      {
        text: 'Tools',
        items: [
          { text: 'Ch 5: AI Coding Tools', link: '/05-ai-coding-tools/' },
          { text: 'Ch 6: Context Engineering', link: '/06-context-engineering/' },
        ],
      },
      {
        text: 'Capabilities',
        items: [
          { text: 'Ch 7: Function Calling', link: '/07-function-calling/' },
          { text: 'Ch 8: Multimodal AI', link: '/08-multimodal/' },
          { text: 'Ch 9: AI Agent', link: '/09-ai-agents/' },
          { text: 'Ch 10: Multi-Agent', link: '/10-multi-agent/' },
        ],
      },
      {
        text: 'Ecosystem',
        items: [
          { text: 'Ch 11: MCP / A2A / ANP', link: '/11-protocols/' },
          { text: 'Ch 12: RAG & Memory', link: '/12-rag-memory/' },
        ],
      },
      {
        text: 'Production',
        items: [
          { text: 'Ch 13: Production', link: '/13-production/' },
        ],
      },
      {
        text: 'Practice',
        items: [
          { text: 'Ch 14: IT Practice', link: '/14-practice/' },
          { text: 'Ch 15: AI Workflow Platforms', link: '/15-ai-workflow/' },
          { text: 'Ch 16: AI for Everyone', link: '/16-ai-for-everyone/' },
        ],
      },
      { text: 'Appendix', link: '/appendix/' },
    ],

    sidebar: {
      '/01-first-experience/': [
        {
          text: 'Part 1: Getting Started',
          items: [
            {
              text: 'Ch 1: Experience AI in 3 Minutes',
              collapsed: false,
              items: [
                { text: '1.1 Your First AI Conversation', link: '/01-first-experience/' },
                { text: '1.2 Free Options & Zero-Cost Start', link: '/01-first-experience/free-options' },
              ],
            },
          ],
        },
      ],
      '/02-ai-landscape/': [
        {
          text: 'Part 1: Getting Started',
          items: [
            {
              text: 'Ch 2: AI Landscape & Platforms',
              collapsed: false,
              items: [
                { text: '2.1 AI Landscape', link: '/02-ai-landscape/' },
                { text: '2.2 Model Providers', link: '/02-ai-landscape/model-providers' },
                { text: '2.3 Aggregators & Gateways', link: '/02-ai-landscape/aggregators' },
                { text: '2.4 Local Deployment', link: '/02-ai-landscape/local-deployment' },
                { text: '2.5 Open-Source Reasoning Models', link: '/02-ai-landscape/open-source-models' },
              ],
            },
          ],
        },
      ],
      '/03-llm-fundamentals/': [
        {
          text: 'Part 1: Getting Started',
          items: [
            {
              text: 'Ch 3: LLM Fundamentals',
              collapsed: false,
              items: [
                { text: '3.1 Tokens & Tokenization', link: '/03-llm-fundamentals/' },
                { text: '3.2 Inference Parameters', link: '/03-llm-fundamentals/parameters' },
                { text: '3.3 Reasoning Models & CoT', link: '/03-llm-fundamentals/reasoning-models' },
                { text: '3.4 Fine-tuning & Distillation', link: '/03-llm-fundamentals/fine-tuning' },
              ],
            },
          ],
        },
      ],
      '/04-prompt-engineering/': [
        {
          text: 'Part 1: Getting Started',
          items: [
            {
              text: 'Ch 4: Prompt Engineering',
              collapsed: false,
              items: [
                { text: '4.1 Prompt Fundamentals', link: '/04-prompt-engineering/' },
                { text: '4.2 Advanced Techniques', link: '/04-prompt-engineering/advanced-techniques' },
                { text: '4.3 Structured Output', link: '/04-prompt-engineering/structured-output' },
              ],
            },
          ],
        },
      ],
      '/05-ai-coding-tools/': [
        {
          text: 'Part 2: Tools',
          items: [
            {
              text: 'Ch 5: AI Coding Tools',
              collapsed: false,
              items: [
                { text: '5.1 IDE Integrated Tools', link: '/05-ai-coding-tools/' },
                { text: '5.2 Terminal Native Tools', link: '/05-ai-coding-tools/terminal-tools' },
                { text: '5.3 Cloud AI Development', link: '/05-ai-coding-tools/cloud-ai' },
                { text: '5.4 Tool Selection Guide', link: '/05-ai-coding-tools/selection-guide' },
                { text: '5.5 Personal AI Agents (OpenClaw)', link: '/05-ai-coding-tools/personal-agents' },
                { text: '5.6 AI Testing Tools', link: '/05-ai-coding-tools/testing-tools' },
                { text: '5.7 AI Search & Research Tools', link: '/05-ai-coding-tools/ai-search' },
              ],
            },
          ],
        },
      ],
      '/06-context-engineering/': [
        {
          text: 'Part 2: Tools',
          items: [
            {
              text: 'Ch 6: Context Engineering',
              collapsed: false,
              items: [
                { text: '6.1 Context Engineering Concepts', link: '/06-context-engineering/' },
                { text: '6.2 AGENTS.md Standard', link: '/06-context-engineering/agents-md' },
                { text: '6.3 Rules & Skills System', link: '/06-context-engineering/rules-skills' },
                { text: '6.4 Vibe Coding & AI-First Flow', link: '/06-context-engineering/vibe-coding' },
                { text: '6.5 Ralph Wiggum Pattern', link: '/06-context-engineering/ralph-pattern' },
              ],
            },
          ],
        },
      ],
      '/07-function-calling/': [
        {
          text: 'Part 3: Capabilities',
          items: [
            {
              text: 'Ch 7: Function Calling & Tool Use',
              collapsed: false,
              items: [
                { text: '7.1 Function Calling Principles', link: '/07-function-calling/' },
                { text: '7.2 Tool Use in Practice', link: '/07-function-calling/tool-use' },
                { text: '7.3 Tool Orchestration & Fallback', link: '/07-function-calling/orchestration' },
              ],
            },
          ],
        },
      ],
      '/08-multimodal/': [
        {
          text: 'Part 3: Capabilities',
          items: [
            {
              text: 'Ch 8: Multimodal AI',
              collapsed: false,
              items: [
                { text: '8.1 Vision (Image Understanding)', link: '/08-multimodal/' },
                { text: '8.2 Image Generation', link: '/08-multimodal/image-generation' },
                { text: '8.3 Speech & Audio', link: '/08-multimodal/speech-audio' },
                { text: '8.4 Video & Realtime', link: '/08-multimodal/video-realtime' },
                { text: '8.5 Multimodal Practice', link: '/08-multimodal/multimodal-practice' },
              ],
            },
          ],
        },
      ],
      '/09-ai-agents/': [
        {
          text: 'Part 3: Capabilities',
          items: [
            {
              text: 'Ch 9: AI Agent',
              collapsed: false,
              items: [
                { text: '9.1 Agent Core Concepts', link: '/09-ai-agents/' },
                { text: '9.2 ReAct Pattern', link: '/09-ai-agents/react' },
                { text: '9.3 Agent Frameworks', link: '/09-ai-agents/frameworks' },
                { text: '9.4 Computer Use', link: '/09-ai-agents/computer-use' },
                { text: '9.5 AI-Native Development', link: '/09-ai-agents/ai-native-dev' },
                { text: '9.6 Browser Use & Web Agent', link: '/09-ai-agents/browser-use' },
              ],
            },
          ],
        },
      ],
      '/10-multi-agent/': [
        {
          text: 'Part 3: Capabilities',
          items: [
            {
              text: 'Ch 10: Multi-Agent',
              collapsed: false,
              items: [
                { text: '10.1 Multi-Agent Architecture', link: '/10-multi-agent/' },
                { text: '10.2 Sub-Agent & Handoff', link: '/10-multi-agent/handoff' },
                { text: '10.3 Multi-Agent Research System', link: '/10-multi-agent/research-system' },
              ],
            },
          ],
        },
      ],
      '/11-protocols/': [
        {
          text: 'Part 4: Ecosystem',
          items: [
            {
              text: 'Ch 11: MCP / A2A / ANP',
              collapsed: false,
              items: [
                { text: '11.1 MCP Protocol', link: '/11-protocols/' },
                { text: '11.2 A2A Protocol', link: '/11-protocols/a2a' },
                { text: '11.3 ANP Protocol', link: '/11-protocols/anp' },
                { text: '11.4 Protocol Ecosystem', link: '/11-protocols/ecosystem' },
                { text: '11.5 AG-UI Protocol', link: '/11-protocols/ag-ui' },
                { text: '11.6 Protocol Convergence', link: '/11-protocols/convergence' },
              ],
            },
          ],
        },
      ],
      '/12-rag-memory/': [
        {
          text: 'Part 4: Ecosystem',
          items: [
            {
              text: 'Ch 12: RAG & Memory Storage',
              collapsed: false,
              items: [
                { text: '12.1 RAG Fundamentals', link: '/12-rag-memory/' },
                { text: '12.2 Embeddings & Vector DB', link: '/12-rag-memory/embeddings' },
                { text: '12.3 Advanced RAG', link: '/12-rag-memory/advanced-rag' },
                { text: '12.4 Memory & Storage', link: '/12-rag-memory/memory' },
                { text: '12.5 GraphRAG', link: '/12-rag-memory/graph-rag' },
                { text: '12.6 Agentic RAG', link: '/12-rag-memory/agentic-rag' },
                { text: '12.7 AI Memory Products', link: '/12-rag-memory/memory-products' },
              ],
            },
          ],
        },
      ],
      '/13-production/': [
        {
          text: 'Part 5: Production',
          items: [
            {
              text: 'Ch 13: Production',
              collapsed: false,
              items: [
                { text: '13.1 Guardrails', link: '/13-production/' },
                { text: '13.2 Evaluation', link: '/13-production/evaluation' },
                { text: '13.3 Observability', link: '/13-production/observability' },
                { text: '13.4 Cost Optimization & Security', link: '/13-production/cost-security' },
                { text: '13.5 AI Safety & Compliance', link: '/13-production/safety-compliance' },
                { text: '13.6 AI Regulations & Global Governance', link: '/13-production/regulations' },
              ],
            },
          ],
        },
      ],
      '/14-practice/': [
        {
          text: 'Part 6: Practice',
          items: [
            {
              text: 'Ch 14: IT Practice Scenarios',
              collapsed: false,
              items: [
                { text: '14.1 Knowledge Base Q&A System', link: '/14-practice/' },
                { text: '14.2 AI Code Review Assistant', link: '/14-practice/code-review' },
                { text: '14.3 IT Ops Assistant', link: '/14-practice/ops-assistant' },
                { text: '14.4 Team AI Toolchain', link: '/14-practice/team-toolchain' },
                { text: '14.5 AI-Powered Data Analysis', link: '/14-practice/data-analysis' },
                { text: '14.6 AI Document & Knowledge Management', link: '/14-practice/doc-management' },
              ],
            },
          ],
        },
      ],
      '/15-ai-workflow/': [
        {
          text: 'Part 6: Practice',
          items: [
            {
              text: 'Ch 15: AI Workflow & Automation Platforms',
              collapsed: false,
              items: [
                { text: '15.1 AI Orchestration Landscape', link: '/15-ai-workflow/' },
                { text: '15.2 Platform Deep Dive', link: '/15-ai-workflow/platforms' },
              ],
            },
          ],
        },
      ],
      '/16-ai-for-everyone/': [
        {
          text: 'Part 6: Practice',
          items: [
            {
              text: 'Ch 16: AI for Everyone',
              collapsed: false,
              items: [
                { text: '16.1 Everyone Can Be a Developer', link: '/16-ai-for-everyone/' },
              ],
            },
          ],
        },
      ],
      '/appendix/': [
        {
          text: 'Appendix',
          items: [
            { text: 'A. Glossary', link: '/appendix/' },
            { text: 'B. Tech Radar', link: '/appendix/tech-radar' },
            { text: 'C. Resources', link: '/appendix/resources' },
            { text: 'D. FAQ', link: '/appendix/faq' },
            { text: 'E. 2026 Buzzwords', link: '/appendix/buzzwords-2026' },
            { text: 'F. Learning Paths', link: '/appendix/learning-paths' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    lastUpdated: {
      text: 'Last updated',
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },

    footer: {
      message: 'An AI coding guide for IT teams',
      copyright: 'MIT License',
    },
  },
}
