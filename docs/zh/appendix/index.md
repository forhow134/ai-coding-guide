# 附录 A：术语表

本术语表收录了 AI 编程领域的核心概念和常用术语，帮助你快速理解技术文档和行业讨论。

::: tip 阅读建议
每个术语都配备了正经解释和不正经吐槽。工作中只能用前者，但后者能帮你真正理解它。
:::

## 基础概念

| 英文术语 | 中文翻译 | 正经说明 | 人话翻译 |
|---------|---------|---------|---------|
| AI (Artificial Intelligence) | 人工智能 | 让机器模拟人类智能行为的技术领域 | 教电脑装聪明 |
| ML (Machine Learning) | 机器学习 | AI 的子集，通过数据训练模型而非显式编程 | 让电脑从错误中学习，就像人类但不抱怨 |
| DL (Deep Learning) | 深度学习 | 基于神经网络的机器学习方法 | 机器学习，但层数很多，显得很厉害 |
| LLM (Large Language Model) | 大语言模型 | 在海量文本上训练的大规模神经网络模型 | 读完互联网后会聊天的巨型统计机器 |
| NLP (Natural Language Processing) | 自然语言处理 | 让计算机理解和生成人类语言的技术 | 教电脑理解人话（比教人类理解人话容易） |
| Transformer | Transformer 架构 | 现代 LLM 的核心架构，基于注意力机制 | 2017 年的论文，至今还在吃老本的神级架构 |
| Token | 令牌 | 模型处理文本的基本单位，通常为词或子词 | AI 的口粮，按粒收费，中文比英文贵——语言界的进口税 |
| Embedding | 嵌入/向量化 | 将文本转换为数值向量的过程 | 把文字变成一堆数字，让电脑能算数学题 |
| Fine-tuning | 微调 | 在预训练模型基础上针对特定任务继续训练 | 给模型上私教课 |
| Pre-training | 预训练 | 在大规模数据上进行的初始训练阶段 | 让模型上完九年义务教育 |
| Context Window | 上下文窗口 | 模型一次能处理的最大 token 数量 | AI 的短期记忆容量，超了就失忆 |
| Neural Network | 神经网络 | 模仿生物神经元的计算模型 | 听起来很生物学，其实就是矩阵乘法 |
| Training Data | 训练数据 | 用于训练模型的数据集 | AI 的教科书，质量决定它有多靠谱 |
| Model Parameters | 模型参数 | 神经网络中可学习的权重数量 | 参数越多，模型越聪明（也越费钱） |

## 模型与推理

| 英文术语 | 中文翻译 | 正经说明 | 人话翻译 |
|---------|---------|---------|---------|
| GPT (Generative Pre-trained Transformer) | 生成式预训练 Transformer | OpenAI 的 LLM 系列（GPT-4.1, GPT-5 等） | 那个让你失业焦虑的聊天机器人系列 |
| Claude | Claude | Anthropic 公司的 LLM 系列（Claude Sonnet 4.6, Opus 4.6） | 程序员最爱，会写代码还有礼貌 |
| Gemini | Gemini | Google 的多模态 LLM 系列（Gemini 2.5, 3.1 Pro） | Google 证明自己还能做出好产品的希望 |
| DeepSeek | DeepSeek | 国产开源 LLM（V3.2, R1），性能优异 | 国货之光，性价比之王，老板最喜欢 |
| Temperature | 温度参数 | 控制输出随机性，0=确定性，2=高随机性 | 调到 0 = 无聊但靠谱，调到 2 = 有趣但胡说八道 |
| Top-p (Nucleus Sampling) | 核采样 | 从累积概率达到 p 的候选词中采样 | Temperature 的文艺版本 |
| Max Tokens | 最大令牌数 | 生成响应的最大长度限制 | 你能让 AI 说多少话（超了会被截断） |
| Inference | 推理 | 使用训练好的模型生成输出的过程 | 模型开始干活了 |
| Reasoning Model | 推理模型 | 具有增强逻辑推理能力的模型（如 o1, o3） | 会"思考"的模型，但你得为它的内心独白买单 |
| Chain-of-Thought (CoT) | 思维链 | 让模型逐步展示推理过程的技术 | 要求 AI"说出你的解题步骤" |
| Few-Shot Learning | 少样本学习 | 在 Prompt 中提供少量示例引导模型 | 给 AI 看几个例子让它照葫芦画瓢 |
| Zero-Shot Learning | 零样本学习 | 不提供示例直接让模型执行任务 | 直接问 AI，祈祷它会 |
| Multimodal | 多模态 | 能处理文本、图像、音频等多种输入 | 全能型选手，看图说话都会 |
| Vision Model | 视觉模型 | 能理解和分析图像的模型 | 会看图的 AI |

## 开发概念

| 英文术语 | 中文翻译 | 正经说明 | 人话翻译 |
|---------|---------|---------|---------|
| Prompt Engineering | 提示工程 | 设计有效提示词以获得理想输出的技术 | 学会怎么"跟 AI 好好说话" |
| Context Engineering | 上下文工程 | 优化输入上下文以提升模型表现 | 给 AI 喂正确的资料 |
| Vibe Coding | 氛围编程 | 通过自然语言与 AI 协作编程的方式 | 用嘴写代码（终于实现了） |
| AI-Native Development | AI 原生开发 | 以 AI 为核心的软件开发范式 | 让 AI 写代码，人类负责喝咖啡 |
| AI-First Development | AI 优先开发 | 以 AI 为核心的软件开发范式 | AI-Native 的同义词，看你喜欢哪个 |
| Copilot | 副驾驶 | AI 辅助编程工具的统称 | AI 坐副驾驶，你还得掌握方向盘 |
| Function Calling | 函数调用 | 让 LLM 调用外部函数或 API 的能力 | 教 AI 用工具 |
| Tool Use | 工具使用 | 让 AI 使用外部工具扩展能力 | Function Calling 的文艺说法 |
| Structured Output | 结构化输出 | 强制模型输出符合特定 JSON Schema | 让 AI 好好说话，别胡乱输出 |
| Streaming | 流式传输 | 逐步返回生成结果而非等待完成 | 边想边说，就像人类 |
| SSE (Server-Sent Events) | 服务器推送事件 | 实现流式响应的 HTTP 协议 | 让服务器主动推送消息 |
| System Prompt | 系统提示词 | 定义 AI 角色和行为的初始指令 | 给 AI 的"岗位职责说明书" |
| User Message | 用户消息 | 用户发送给 AI 的输入内容 | 你说的话 |
| Assistant Message | 助手消息 | AI 返回的响应内容 | AI 说的话 |
| Token Limit | Token 限制 | 单次请求的最大 token 数 | 一次对话能说多少话 |

## Agent 相关

| 英文术语 | 中文翻译 | 正经说明 | 人话翻译 |
|---------|---------|---------|---------|
| AI Agent | AI 智能体 | 能自主决策和执行任务的 AI 系统 | 有自主性的 AI，会自己想办法完成任务 |
| Agentic AI | 智能体 AI | 具有自主性的 AI 系统 | AI Agent 的形容词形式 |
| ReAct (Reasoning + Acting) | 推理-行动模式 | Agent 交替进行推理和行动的框架 | 想一想，做一做，再想想，再做做 |
| Multi-Agent | 多智能体 | 多个 Agent 协作完成复杂任务 | AI 团队协作，有时也会扯皮 |
| Sub-Agent | 子智能体 | 被主 Agent 调用的专用 Agent | Agent 的小弟 |
| Handoff | 移交 | Agent 之间转移任务控制权 | "这活我干不了，交给隔壁老王" |
| Computer Use | 计算机使用 | AI 直接操作计算机界面（如 Claude） | 给 AI 鼠标键盘，看着它点点点 |
| Planning | 规划 | Agent 制定任务执行计划的能力 | AI 做计划（通常比你靠谱） |
| Memory | 记忆 | Agent 存储和检索历史信息的能力 | AI 的大脑，能记住之前说过的话 |
| Reflection | 反思 | Agent 评估和改进自身行为的能力 | AI 自我检讨（比人类更擅长） |
| Autonomous Agent | 自主智能体 | 能独立完成任务而无需人工干预 | 全自动 AI，放着不管也能干活 |
| Tool Agent | 工具智能体 | 专门调用外部工具的 Agent | 专门负责调 API 的 AI |
| AG-UI (Agentic UI) | 智能体界面 | AI 动态生成的用户界面 | AI 自己设计界面给你用 |

## 协议与基础设施

| 英文术语 | 中文翻译 | 正经说明 | 人话翻译 |
|---------|---------|---------|---------|
| MCP (Model Context Protocol) | 模型上下文协议 | Anthropic 提出的 AI 上下文标准协议 | AI 工具的 USB-C 接口标准 |
| A2A (Agent-to-Agent) | Agent 间协议 | Google 提出的 Agent 通信标准 | AI 之间的通话协议 |
| ANP (Agent Network Protocol) | Agent 网络协议 | OpenAI 提出的 Agent 互联标准 | Agent 的局域网协议 |
| RAG (Retrieval-Augmented Generation) | 检索增强生成 | 结合外部知识库的生成技术 | 让 AI 先查资料再回答 |
| Agentic RAG | 智能体 RAG | Agent 主导的智能检索增强生成 | RAG 2.0，AI 自己决定查什么 |
| GraphRAG | 图谱 RAG | 基于知识图谱的 RAG | 理解关系的 RAG，更聪明 |
| Vector Database | 向量数据库 | 存储和检索向量数据的专用数据库 | 存 AI 能懂的数字的数据库 |
| Semantic Search | 语义搜索 | 基于语义相似度而非关键词的搜索 | 理解你真正想找什么的搜索 |
| Chunking | 分块 | 将长文档切分为小块以便处理 | 把长文章切碎，AI 好消化 |
| Reranking | 重排序 | 对检索结果按相关性重新排序 | 二次筛选，把最相关的放前面 |
| API Gateway | API 网关 | 统一管理和路由 API 请求 | API 的交通警察 |
| Load Balancing | 负载均衡 | 在多个服务实例间分配请求 | 别让一台机器累死 |

## 生产化

| 英文术语 | 中文翻译 | 正经说明 | 人话翻译 |
|---------|---------|---------|---------|
| Guardrails | 护栏 | 限制模型输出范围和质量的机制 | 防止 AI 说不该说的话 |
| Evaluation | 评估 | 测量模型性能和输出质量 | 给 AI 打分 |
| Observability | 可观测性 | 监控和调试 AI 系统的能力 | 知道 AI 在干什么 |
| Prompt Caching | 提示缓存 | 缓存常用提示以降低成本和延迟 | 记住常问的问题，省钱省时间 |
| Batch API | 批处理 API | 异步批量处理请求以降低成本 | 不急的任务打包处理，便宜 50% |
| Prompt Injection | 提示注入 | 恶意用户尝试操控模型行为的攻击 | "忽略之前的指令"那一套 |
| Jailbreak | 越狱 | 绕过模型安全限制的技术 | 骗 AI 做它不该做的事 |
| Rate Limiting | 速率限制 | 限制 API 调用频率防止滥用 | 别一直薅羊毛 |
| Cost Optimization | 成本优化 | 降低 AI 应用运行成本的策略 | 省钱大法 |
| Model Versioning | 模型版本管理 | 管理不同版本模型的部署和切换 | 新旧模型版本管理 |
| A/B Testing | A/B 测试 | 对比不同模型或提示的效果 | 看哪个更好用 |
| Fallback | 降级策略 | 主服务失败时的备用方案 | Plan B |
| Monitoring | 监控 | 实时跟踪系统运行状态和指标 | 盯着看有没有出问题 |
| Logging | 日志记录 | 记录请求、响应和错误信息 | 记录一切，方便甩锅 |
| Hallucination | 幻觉 | AI 自信地陈述虚假信息 | AI 一本正经地胡说八道 |

## 新兴概念（2026）

| 英文术语 | 中文翻译 | 正经说明 | 人话翻译 |
|---------|---------|---------|---------|
| OpenClaw | OpenClaw | 开源个人 AI Agent 框架 | 开源版钢铁侠贾维斯 |
| Generative UI | 生成式 UI | AI 动态生成用户界面 | AI 当场给你设计界面 |
| MCP Apps | MCP 应用 | 基于 MCP 协议的工具生态 | MCP 工具商店 |
| Spec-Driven Development | 规范驱动开发 | 写规范让 AI 生成代码的开发方式 | 写需求文档，AI 写代码 |
| Ralph Wiggum Mode | Ralph Wiggum 模式 | 持续运行的自主编码循环 | 让 AI 自己编程一整夜 |
| Agentic RL | 智能体强化学习 | 用强化学习训练 Agent | 通过试错教 AI 做事 |
| Context Stuffing | 上下文填充 | 在提示中塞入大量上下文 | 给 AI 喂一堆背景资料 |
| Token Economics | Token 经济 | 优化 token 使用降低成本 | API 账单太高的学术说法 |
| Model Distillation | 模型蒸馏 | 用大模型训练小模型 | 让小学生向大学教授学习 |

---

::: tip 使用建议
- 在正式文档中使用"正经说明"
- 在团队内部交流时，"人话翻译"更容易理解
- 如果遇到没有的术语，欢迎提交 Issue 或 PR
:::

*最后更新：2026-02-22*
