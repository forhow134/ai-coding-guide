# Appendix A: Glossary

This glossary includes core concepts and common terminology in the AI programming field, helping you quickly understand technical documentation and industry discussions.

## Basic Concepts

| English Term | Chinese Translation | Brief Description |
|---------|---------|---------|
| AI (Artificial Intelligence) | Artificial Intelligence | Technical field enabling machines to simulate human intelligent behavior |
| ML (Machine Learning) | Machine Learning | Subset of AI, training models through data rather than explicit programming |
| DL (Deep Learning) | Deep Learning | Machine learning approach based on neural networks |
| LLM (Large Language Model) | Large Language Model | Large-scale neural network models trained on massive text data |
| NLP (Natural Language Processing) | Natural Language Processing | Technology enabling computers to understand and generate human language |
| Transformer | Transformer Architecture | Core architecture of modern LLMs, based on attention mechanism |
| Token | Token | Basic unit of text processing by models, typically word or subword |
| Embedding | Embedding/Vectorization | Process of converting text to numerical vectors |
| Fine-tuning | Fine-tuning | Continued training on pre-trained models for specific tasks |
| Pre-training | Pre-training | Initial training stage on large-scale data |
| Context Window | Context Window | Maximum number of tokens a model can process at once |
| Neural Network | Neural Network | Computational model mimicking biological neurons |
| Training Data | Training Data | Dataset used to train models |
| Model Parameters | Model Parameters | Number of learnable weights in a neural network |

## Models and Inference

| English Term | Chinese Translation | Brief Description |
|---------|---------|---------|
| GPT (Generative Pre-trained Transformer) | Generative Pre-trained Transformer | OpenAI's LLM series (GPT-4.1, GPT-5, etc.) |
| Claude | Claude | Anthropic's LLM series (Claude Sonnet 4.6, Opus 4.6) |
| Gemini | Gemini | Google's multimodal LLM series (Gemini 2.5, 3.1 Pro) |
| DeepSeek | DeepSeek | Open-source LLM with excellent performance (V3.2, R1) |
| Temperature | Temperature Parameter | Controls output randomness, 0=deterministic, 2=high randomness |
| Top-p (Nucleus Sampling) | Nucleus Sampling | Sample from candidate words with cumulative probability reaching p |
| Max Tokens | Max Tokens | Maximum length limit for generated responses |
| Inference | Inference | Process of using trained model to generate output |
| Reasoning Model | Reasoning Model | Models with enhanced logical reasoning capabilities (e.g., o1) |
| Chain-of-Thought (CoT) | Chain-of-Thought | Technique for models to show reasoning process step by step |
| Few-Shot Learning | Few-Shot Learning | Guiding model with few examples in prompt |
| Zero-Shot Learning | Zero-Shot Learning | Having model execute task without providing examples |
| Multimodal | Multimodal | Can process multiple inputs like text, images, audio |
| Vision Model | Vision Model | Models that can understand and analyze images |

## Development Concepts

| English Term | Chinese Translation | Brief Description |
|---------|---------|---------|
| Prompt Engineering | Prompt Engineering | Technique of designing effective prompts to get desired outputs |
| Context Engineering | Context Engineering | Optimizing input context to enhance model performance |
| Vibe Coding | Vibe Coding | Programming collaboratively with AI through natural language |
| AI-First Development | AI-First Development | Software development paradigm with AI at its core |
| Copilot | Copilot | General term for AI-assisted programming tools |
| Function Calling | Function Calling | Capability for LLM to call external functions or APIs |
| Tool Use | Tool Use | Enabling AI to use external tools to extend capabilities |
| Structured Output | Structured Output | Forcing model output to conform to specific JSON Schema |
| Streaming | Streaming | Returning generated results progressively rather than waiting for completion |
| SSE (Server-Sent Events) | Server-Sent Events | HTTP protocol for implementing streaming responses |
| System Prompt | System Prompt | Initial instructions defining AI role and behavior |
| User Message | User Message | Input content sent to AI by user |
| Assistant Message | Assistant Message | Response content returned by AI |
| Token Limit | Token Limit | Maximum token count per request |

## Agent Related

| English Term | Chinese Translation | Brief Description |
|---------|---------|---------|
| AI Agent | AI Agent | AI system capable of autonomous decision-making and task execution |
| ReAct (Reasoning + Acting) | Reasoning-Action Pattern | Framework where agents alternate between reasoning and action |
| Multi-Agent | Multi-Agent | Multiple agents collaborating to complete complex tasks |
| Sub-Agent | Sub-Agent | Specialized agents called by main agent |
| Handoff | Handoff | Transfer of task control between agents |
| Computer Use | Computer Use | AI directly operating computer interface (e.g., Claude) |
| Agentic AI | Agentic AI | AI systems with autonomy |
| Planning | Planning | Agent's ability to formulate task execution plans |
| Memory | Memory | Agent's ability to store and retrieve historical information |
| Reflection | Reflection | Agent's ability to evaluate and improve own behavior |
| Autonomous Agent | Autonomous Agent | Can complete tasks independently without human intervention |
| Tool Agent | Tool Agent | Agent specialized in calling external tools |

## Protocols and Infrastructure

| English Term | Chinese Translation | Brief Description |
|---------|---------|---------|
| MCP (Model Context Protocol) | Model Context Protocol | AI context standard protocol proposed by Anthropic |
| A2A (Agent-to-Agent) | Agent-to-Agent Protocol | Agent communication standard proposed by Google |
| ANP (Agent Network Protocol) | Agent Network Protocol | Agent interconnection standard proposed by OpenAI |
| RAG (Retrieval-Augmented Generation) | Retrieval-Augmented Generation | Generation technique combining external knowledge bases |
| Vector Database | Vector Database | Specialized database for storing and retrieving vector data |
| Semantic Search | Semantic Search | Search based on semantic similarity rather than keywords |
| Chunking | Chunking | Splitting long documents into smaller chunks for processing |
| Reranking | Reranking | Re-sorting retrieval results by relevance |
| API Gateway | API Gateway | Unified management and routing of API requests |
| Load Balancing | Load Balancing | Distributing requests across multiple service instances |

## Production

| English Term | Chinese Translation | Brief Description |
|---------|---------|---------|
| Guardrails | Guardrails | Mechanisms limiting model output range and quality |
| Evaluation | Evaluation | Measuring model performance and output quality |
| Observability | Observability | Ability to monitor and debug AI systems |
| Prompt Caching | Prompt Caching | Caching common prompts to reduce cost and latency |
| Batch API | Batch API | Asynchronously batch processing requests to reduce cost |
| Prompt Injection | Prompt Injection | Attacks where malicious users try to manipulate model behavior |
| Jailbreak | Jailbreak | Techniques to bypass model security restrictions |
| Rate Limiting | Rate Limiting | Limiting API call frequency to prevent abuse |
| Cost Optimization | Cost Optimization | Strategies to reduce AI application operating costs |
| Model Versioning | Model Versioning | Managing deployment and switching of different model versions |
| A/B Testing | A/B Testing | Comparing effectiveness of different models or prompts |
| Fallback | Fallback | Backup plan when main service fails |
| Monitoring | Monitoring | Real-time tracking of system running status and metrics |
| Logging | Logging | Recording request, response, and error information |

## Recommended Learning Resources

| Resource | Description | Link |
|----------|-----------|------|
| **learn-claude-code** | Build a Claude Code-like agent from scratch in 11 sessions | [GitHub](https://github.com/shareAI-lab/learn-claude-code) |
| **hello-agents** | Comprehensive guide to building AI agents from zero (Chinese) | [GitHub](https://github.com/datawhalechina/hello-agents) |
| **OpenAI Cookbook** | Official OpenAI code examples and best practices | [GitHub](https://github.com/openai/openai-cookbook) |
| **Anthropic Docs** | Claude API documentation and prompt engineering guide | [docs.anthropic.com](https://docs.anthropic.com) |
| **LangChain Docs** | Popular LLM application framework documentation | [python.langchain.com](https://python.langchain.com) |
| **MCP Specification** | Model Context Protocol official specification | [modelcontextprotocol.io](https://modelcontextprotocol.io) |

---

*Last updated: 2026-02-20*
