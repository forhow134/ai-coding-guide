---
prev:
  text: '15.1 AI Orchestration Platform Landscape'
  link: '/15-ai-workflow/'
next:
  text: '16.1 Everyone Can Code'
  link: '/16-ai-for-everyone/'
---

# 15.2 Platform Deep Dive

In the previous section, we surveyed the AI orchestration platform landscape. Now it's time to roll up our sleeves, dive into each platform's engine room, and see how they actually work and **which is most suitable for you**.

## Dify: Open-Source LLMOps Champion

### Genetic Profile

**Origin:** Born in China in 2023, founding team deeply understands Chinese developers' pain points  
**Positioning:** Open-source LLM application development platform, benchmarks OpenAI's GPT Builder (but more powerful)  
**Slogan:** "Build AI apps in minutes, not months"  
**GitHub Stars:** 50,000+ (2026 data)

### Core Capabilities Breakdown

Dify isn't simply a "chatbot builder"—it's a **complete LLMOps platform** covering the entire lifecycle from development, testing to deployment, and monitoring.

#### 1. Three Application Types

**Chat Assistant**
- ChatGPT-like conversational interface
- Supports multi-turn conversation, context memory
- Can inject knowledge base, tool calling

```
User: Help me analyze this month's sales data
AI: [Call database tool] Okay, I see this month's sales are...
    [Generate chart] Here's the trend chart...
    Need me to analyze any region in depth?
```

**Text Generator**
- Single input-output, no context
- Suitable for content generation, translation, summarization tasks
- Can batch process

```
Input: [Upload 100 articles]
Output: [Auto-generate 100 SEO-friendly titles]
```

**AI Workflow**
- Complex multi-step orchestration
- Supports conditional branches, loops, parallel execution
- This is Dify's most powerful feature

```
[Receive customer email]
    ↓
[AI analyze sentiment] → If negative sentiment → [Mark as priority 1]
    ↓                                           ↓
[Extract key information]                    [Notify supervisor]
    ↓
[Retrieve history]
    ↓
[AI generate reply draft]
    ↓
[Send to review queue]
```

#### 2. Knowledge Base System

Dify's knowledge base isn't simply "upload documents"—it's a **professional-grade RAG engine**:

**Document Processing:**
- Supported formats: PDF, Word, Markdown, TXT, HTML, XLSX, CSV
- Auto-parsing: Table recognition, image OCR, web scraping
- Incremental updates: Auto-sync after document modifications

**Chunking Strategy:**
```
Auto mode: AI intelligent chunking (recognize paragraphs, sections)
Fixed length: Split by character count (can set overlap)
Custom: Manual control with separators
```

**Retrieval Algorithms:**
- Vector retrieval: Semantic similarity (default)
- Full-text retrieval: Keyword matching
- Hybrid retrieval: Combine both, reranking

**Embedding Model Selection:**
```
OpenAI text-embedding-3-large (recommended, best quality)
OpenAI text-embedding-ada-002 (cost-effective)
Local models: BGE, M3E, GTE (free, requires self-deployment)
```

#### 3. Prompt Orchestration

Dify's Prompt editor is an exemplary design **both programmers and product managers can use**:

**Variable System:**

```jinja-raw
You are a \{\{role}}, your task is \{\{task}}.

User information:
- Name: \{\{user.name}}
- Purchase history: \{\{user.purchase_history}}

Based on the above information, \{\{instruction}}
```

**Built-in Variables:**
- `\{\{query}}`: User input
- `\{\{context}}`: Knowledge base retrieval results
- `\{\{history}}`: Conversation history
- `\{\{sys.date}}`: Current date
- `\{\{sys.time}}`: Current time

**Prompt Debugging:**
- Real-time preview: See actual Prompt after variable substitution
- A/B testing: Compare different Prompt versions
- History: Save effects of each iteration

#### 4. Tool Calling (Function Calling)

Dify wraps OpenAI's Function Calling into **visual configuration**:

**Built-in Tools:**
- Google Search
- Wikipedia queries
- Weather queries
- DuckDuckGo Search

**Custom Tools:**
```yaml
# Example: Query inventory
Tool name: check_inventory
Description: Query product inventory quantity
Parameters:
  - product_id (required): Product ID
  - warehouse (optional): Warehouse location
API endpoint: https://api.yourcompany.com/inventory
Method: POST
Authentication: Bearer Token
```

**Tool Orchestration:**
```
User: "Help me check tomorrow's Beijing weather, if it rains recommend indoor activities"

AI execution process:
1. Call weather tool → Get tomorrow's Beijing weather
2. Judge: If weather.condition == "rain"
3. Call search tool → Search "Beijing indoor activity recommendations"
4. Synthesize results to generate reply
```

### Deployment Methods

**Docker One-Click Deployment (Recommended):**
```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
docker-compose up -d

# Access http://localhost:3000
# Default account: admin@example.com
# Default password: Check logs
```

**Cloud Service (Official Hosting):**
- Free tier: 200 calls/day
- Paid version: Starting at $29/month (unlimited calls, more models)
- Enterprise version: Private deployment + technical support

**Resource Requirements:**
```
Minimum configuration:
- CPU: 2 cores
- Memory: 4GB
- Storage: 20GB

Recommended configuration (production):
- CPU: 4+ cores
- Memory: 8GB+
- Storage: 100GB+
- Plus vector database (Qdrant/Weaviate)
```

### Suitable Scenarios

**Best suited for:**
- Small to medium teams rapidly building AI products
- Enterprises requiring private deployment
- Those wanting open-source free but full-featured solutions
- Chinese users (documentation, community all very friendly)

**Not suited for:**
- Large-scale applications requiring extreme performance optimization (recommend code optimization)
- Complex multi-Agent collaboration (can do but not strong suit)
- Highly customized requirements (may need to modify source code)

---

## Coze: ByteDance's AI LEGO

### Genetic Profile

**Origin:** Launched by ByteDance in 2024, backed by AI technology accumulated from TikTok and Toutiao  
**Positioning:** Next-generation Bot building platform, benchmarks GPTs but emphasizes enterprise capabilities  
**Slogan:** "No code, just logic"  
**Access:** https://www.coze.com

### Core Capabilities Breakdown

#### 1. Bot Building

Coze's core is **Bot** (robot), not a simple chat window, but an **intelligent agent with skills**:

**Persona:**
```
Name: Customer Service Xiaomei
Role: Professional e-commerce customer service
Personality: Enthusiastic, patient, professional
Language style: Warm and natural, uses emoji
Expertise: Order queries, returns/exchanges, product consultation
```

**Skill System:**
- **Plugins**: Pre-built capability modules (search, translation, image generation)
- **Workflows**: Custom complex logic
- **Knowledge**: Proprietary document data
- **Database**: Structured data storage

**Conversation Strategy:**
```
Opening: "Hello! I'm Customer Service Xiaomei, how can I help you?"
Guidance: "You can ask me about orders, logistics, returns"
Fallback: "Sorry, I'm not quite clear on this question, still learning..."
Transfer to human: When complex issues or negative emotions detected, guide to human transfer
```

#### 2. Plugin Marketplace

Coze's strongest feature is **plugin ecosystem**, similar to ChatGPT's GPT Store but more open:

**Official Plugins:**
- Web Search (Google, Bing)
- Image Generation (DALL-E, Midjourney API)
- Video Analysis (extract subtitles, summarize content)
- Code Execution (Python sandbox)
- OCR Recognition

**Community Plugins:**
- Express Tracking (SF Express, JD)
- Weather Forecast (Amap)
- Stock Quotes (Sina Finance)
- Music Search (NetEase Cloud Music)

**Custom Plugins:**
```javascript
// Coze plugins are standard HTTP APIs
// Just define OpenAPI specification

{
  "openapi": "3.0.0",
  "info": {
    "title": "Customer Data Query",
    "version": "1.0.0"
  },
  "paths": {
    "/customer/{id}": {
      "get": {
        "summary": "Get customer information",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ]
      }
    }
  }
}
```

#### 3. Workflow Engine

Coze's workflows are similar to Dify but **more focused on business logic orchestration**:

**Node Types:**
- **LLM Node:** Call different LLMs (GPT-4, Claude, Doubao)
- **Plugin Node:** Call plugin capabilities
- **Knowledge Base Node:** Retrieve documents
- **Code Node:** Execute custom JavaScript code
- **Condition Node:** if-else logic
- **Loop Node:** Batch processing
- **Parallel Node:** Execute multiple tasks simultaneously

**Real Case: Intelligent Recruitment Assistant**
```
[Receive Resume (PDF)]
    ↓
[OCR Node: Extract text]
    ↓
[LLM Node: Structured parsing]
    Output: { "Name": "Zhang San", "Education": "Bachelor", "Years": 5 }
    ↓
[Condition Node: Years >= 3?]
    ├─ Yes → [Knowledge Base Retrieval: Match suitable positions]
    │         ↓
    │       [LLM Node: Generate interview invitation]
    │         ↓
    │       [Email Plugin: Send invitation]
    └─ No → [Database: Store in talent pool]
              ↓
            [End: Mark as "potential candidate"]
```

#### 4. Multi-Platform Publishing

A major highlight of Coze is **build once, publish everywhere**:

**Supported Platforms:**
- Web pages (generate embed code)
- WeChat Official Account (official integration)
- Feishu (ByteDance's own ecosystem)
- Slack
- Discord
- Telegram
- Custom API (integrate any platform)

**Publishing Process:**
```
1. Complete Bot building on Coze platform
2. Click "Publish"
3. Select target platform (e.g., WeChat Official Account)
4. Scan code to authorize
5. Auto-configure Webhook
6. Test → Launch ✅
```

Users send messages on WeChat, behind the scenes it's your Coze Bot responding, **no backend code needed**.

### Pricing

- **Free version:** 100 conversations/day, basic plugins
- **Pro version:** ¥99/month, unlimited conversations, all plugins, priority models
- **Team version:** ¥999/month, multi-person collaboration, data analysis, API calls
- **Enterprise version:** Custom pricing, private deployment, SLA guarantee

### Suitable Scenarios

**Best suited for:**
- Enterprise customer service bots (WeChat, Feishu integration convenient)
- Content creation assistants (rich plugins)
- Marketing automation (multi-platform social media publishing)
- Developers in ByteDance product ecosystem

**Not suited for:**
- Need open-source/self-deployment (Coze is cloud service)
- Complex data processing flows (workflow capabilities limited)
- Non-China markets (mainly for domestic)

---

## n8n + AI: Old Automation's AI Evolution

### Genetic Profile

**Origin:** Born in Germany in 2019, originally an automation workflow tool  
**Positioning:** Fair-code (source visible, commercial use charged) automation platform  
**Transformation:** 2024 heavily embraced AI, added many AI nodes  
**GitHub Stars:** 45,000+

### Why is n8n Special?

If Dify and Coze are "born for AI," then n8n is "born for connection." Its core advantage is: **connect anything**.

**Integration Count:** 400+ applications (Google, Slack, GitHub, Notion, databases...)  
**Triggers:** Scheduled, Webhook, email, file monitoring, database changes...  
**AI Capabilities:** Icing on the cake, not the core

### AI Nodes Detailed

#### 1. AI Agent Node

n8n's Agent is **AI that can use tools**:

```
[Trigger: Webhook receives user request]
    ↓
[AI Agent Node]
  - LLM: GPT-4
  - Tools:
    * Google Search
    * Calculator
    * Database queries
    * Send email
  - Strategy: ReAct (Reason + Act)
    ↓
[Return result]
```

**Actual Execution:**
```
User: "Help me check Tesla's stock price, if it went up send me an email"

AI Agent thinking process:
1. [Call tool: Stock query] → Tesla $250, +3% gain
2. [Reasoning] → Stock went up, need to send email
3. [Call tool: Send email] → Send to user@example.com
4. [Return] → "Sent email notifying you Tesla stock went up"
```

#### 2. AI Langchain Node

Integrates core capabilities of LangChain:

- **Vector Storage:** Pinecone, Qdrant, Weaviate
- **Embedding:** OpenAI, Cohere, HuggingFace
- **Retrievers:** Similarity search, MMR, compression retrieval
- **Chain Types:** Stuff, Map-Reduce, Refine

**RAG Workflow:**
```
[Trigger: New document uploaded to Google Drive]
    ↓
[Google Drive Node: Download file]
    ↓
[Document Loader: Parse PDF]
    ↓
[Text Chunking: Recursive Character Splitter]
    ↓
[OpenAI Embeddings: Vectorize]
    ↓
[Pinecone Node: Store vectors]
    ↓
[Slack Notification: "Document indexing complete"]
```

#### 3. AI Chat Node

Simple conversation interface:

```
[Trigger: Telegram receives message]
    ↓
[AI Chat Node]
  - Model: GPT-4
  - System Prompt: "You are a friendly assistant"
  - Context memory: Keep last 10 conversations
    ↓
[Telegram Node: Send reply]
```

### n8n's Killer Scenarios

#### Scenario 1: Automated Content Pipeline

```
[RSS Subscription: Fetch industry news]
    ↓
[AI Node: Filter relevant articles (spam filtering)]
    ↓
[AI Node: Generate summary]
    ↓
[AI Node: Rewrite in Twitter style]
    ↓
[Condition: Quality score > 8?]
    ├─ Yes → [Twitter API: Auto-publish]
    │         ↓
    │       [Notion: Record published]
    └─ No → [Slack: Send to review channel]
```

#### Scenario 2: Intelligent Customer Onboarding Process

```
[Trigger: CRM new customer]
    ↓
[AI Analysis: Customer industry, size, needs]
    ↓
[Conditional Branch: Customer type]
    ├─ Enterprise → [Send enterprise materials] → [Assign senior account manager]
    ├─ SMB → [Send standard materials] → [Auto-schedule Demo]
    └─ Individual → [Send quick guide] → [Add to user community]
        ↓
[Email Node: Send welcome email (AI generates personalized content)]
    ↓
[Slack: Notify team]
    ↓
[Google Sheets: Update customer report]
```

### Deployment

**Docker Self-Deployment:**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Cloud Service:**
- n8n.cloud: Starting at $20/month (hosted version)
- Self-deployment: Free (production environment recommends commercial license)

### Suitable Scenarios

**Best suited for:**
- Marketing automation (multi-platform content distribution)
- Data sync (between CRM, ERP, analytics tools)
- Personal productivity tools (automate daily repetitive tasks)
- Scenarios needing to connect many SaaS tools

**Not suited for:**
- Pure AI conversation applications (use Dify/Coze more suitable)
- Complex AI logic (workflows become very complex)
- Non-technical pure business people (has some learning curve)

---

## Zapier AI: Automation Giant's AI Ambition

### Genetic Profile

**Origin:** Founded in 2011, veteran in automation field  
**Users:** 2 million+, connecting 6000+ applications  
**AI Transformation:** Launched Zapier AI in 2023, large-scale adoption in 2024

### AI Features

#### 1. AI Actions

Insert AI capabilities into Zapier workflows:

- **AI Text Generator:** Generate text, rewrite, translate
- **AI Classifier:** Classify, tag, sentiment analysis
- **AI Extractor:** Extract information from unstructured text
- **AI Chatbot:** Embeddable website chatbot

**Example: Email Auto-Classification**
```
[Trigger: Gmail receives new email]
    ↓
[AI Classifier: Classify email type]
    Output: "Complaint"
    ↓
[Condition: If complaint]
    ↓
[AI Text Generator: Generate apology template]
    ↓
[Gmail: Send draft for review]
    ↓
[Slack: Notify customer service supervisor]
```

#### 2. Zapier Chatbots

Build your own AI assistant with Zapier:

- Connect your data sources (Google Drive, Notion, databases)
- Auto-train AI (based on document content)
- One-click embed in website (generate code snippet)

**Value:** Non-technical people can also build enterprise knowledge base Q&A systems.

### Pricing

- **Free version:** 100 tasks/month, basic integrations
- **Starter:** $29.99/month, 750 tasks/month
- **Professional:** $73.50/month, 2000 tasks/month, AI Actions
- **Team:** $103.50/month, team collaboration, advanced AI
- **Enterprise:** Custom pricing

**Note:** Zapier is relatively expensive, for high-frequency tasks, n8n self-deployment might be more cost-effective.

### Suitable Scenarios

**Best suited for:**
- Non-technical teams (easiest to use)
- Connect mainstream foreign SaaS (most complete integrations)
- SMBs for rapid automation (no IT team needed)

**Not suited for:**
- High-frequency tasks (high cost)
- Need complex AI logic (limited capabilities)
- Need private deployment (cloud service only)

---

## FlowiseAI: LangChain's Visual Frontend

### Genetic Profile

**Origin:** Open-sourced in 2023, focused on LangChain visualization  
**Positioning:** LangChain for developers who don't want to write code  
**GitHub Stars:** 30,000+

### Core Features

**1. Nodes Correspond to LangChain Components**

Each drag node directly corresponds to LangChain's Python/JS classes:

```
Document Loaders → langchain.document_loaders
Text Splitters → langchain.text_splitter
Embeddings → langchain.embeddings
Vector Stores → langchain.vectorstores
Retrievers → langchain.retrievers
LLMs → langchain.llms
Chains → langchain.chains
Agents → langchain.agents
```

**Value:** If you know LangChain, getting started with FlowiseAI has zero learning curve. If you don't, using FlowiseAI is the best way to learn LangChain.

**2. Fine Parameter Control**

Unlike Dify's "out-of-the-box," FlowiseAI exposes **all underlying parameters**:

```
Text Splitter Node:
- Chunk Size: 1000 (adjustable)
- Chunk Overlap: 200 (adjustable)
- Separator: "\n\n" (customizable)
- Length Function: len (can choose tiktoken)
```

This is a double-edged sword: flexible but complex.

**3. Local First**

FlowiseAI emphasizes **local deployment and privacy**:

- Supports Ollama (local large models)
- Supports local vector databases (Chroma, Qdrant)
- Data doesn't leave your server

### Suitable Scenarios

**Best suited for:**
- AI engineers for rapid prototyping
- Developers learning LangChain
- Scenarios requiring fine control of RAG pipeline
- Privacy-focused enterprises (local deployment)

**Not suited for:**
- Non-technical people (too complex)
- Simple chatbots (overkill)
- Production environment (stability not as good as code)

---

## Platform Comparison Table

| Dimension | Dify | Coze | n8n | Zapier | FlowiseAI |
|------|------|------|-----|--------|-----------|
| **Open-Source** | ✅ MIT | ❌ Closed | ✅ Fair-code | ❌ Closed | ✅ Apache 2.0 |
| **Self-Deploy** | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Chinese Support** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Learning Curve** | Low | Low | Medium | Low | Medium-High |
| **AI Capability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Integration Count** | 50+ | 100+ (plugins) | 400+ | 6000+ | 100+ |
| **Free Tier** | 200 calls/day | 100 calls/day | Unlimited (self-deploy) | 100 tasks/month | Unlimited (self-deploy) |
| **Paid Starting Price** | $29/month | ¥99/month | $20/month | $29.99/month | Free (open-source) |
| **Community Activity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Production Ready** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### Selection Suggestion Matrix

| Your Situation | Recommended Platform | Reasoning |
|---------|---------|------|
| Chinese startup team, rapid MVP | **Dify** | Open-source free, Chinese-friendly, full-featured |
| Enterprise customer service bot (WeChat/Feishu) | **Coze** | Multi-platform publishing convenient, ByteDance ecosystem |
| Marketing automation, connect multiple SaaS | **n8n** or **Zapier** | Rich integrations, mature workflows |
| AI engineer, need low-level control | **FlowiseAI** | Expose all parameters, correspond to LangChain |
| Personal project, zero budget | **Dify** or **n8n** | Open-source self-deploy, completely free |
| Large enterprise, need private deployment | **Dify** or **n8n** | Support local deployment, data security |
| Non-technical team, easiest to use | **Coze** or **Zapier** | Most friendly interface, detailed documentation |

---

## Real Case: Build Customer Service Bot with Dify

Let's use Dify to build an **e-commerce customer service bot** from scratch, entirely without code.

### Requirements

- Can answer order queries, logistics tracking, return/exchange policies
- Can call backend API to query real-time data
- Transfer to human when negative emotion detected
- Support multi-turn conversation

### Steps

#### Step 1: Create Application

1. Login to Dify
2. Click "Create Application"
3. Select "Chat Assistant" template
4. Name: "E-commerce Customer Service Xiaomei"

#### Step 2: Configure Knowledge Base

1. Create knowledge base "Customer Service Documentation"
2. Upload documents:
   - Return-Exchange-Policy.pdf
   - FAQ.docx
   - Product Manuals (multiple)
3. Select chunking strategy: "Auto mode"
4. Select Embedding: "OpenAI text-embedding-3-large"
5. Click "Process and Save" (wait for vectorization to complete)

#### Step 3: Write Prompt

```jinja-raw
# Role
You are "Xiaomei," customer service for an e-commerce platform, professional, enthusiastic, patient.

# Capabilities
- Answer questions about orders, logistics, returns/exchanges
- Query order status (via tools)
- Retrieve company policy documents

# Knowledge Base
\{\{context}}

# Conversation History
\{\{history}}

# User Question
\{\{query}}

# Rules
1. Prioritize using knowledge base information to answer
2. If need to query order, use check_order tool
3. If user emotion is negative (e.g., complaint, anger), guide to human transfer
4. Keep replies concise, use emoji to lighten atmosphere
5. For uncertain questions, honestly say "let me check for you" or "transfer to specialist"

# Reply Format
- First understand user's question
- Provide solution or answer
- Ask if any other help needed
```

#### Step 4: Add Tools

**Custom Tool: Query Order**

```yaml
Tool name: check_order
Description: Query order status, logistics information
Parameters:
  - order_id: Order number (required)
API:
  Endpoint: https://api.yourshop.com/orders/{order_id}
  Method: GET
  Authentication: Bearer ${API_KEY}
Return Example:
  {
    "order_id": "20240101001",
    "status": "Shipped",
    "tracking_number": "SF1234567890",
    "expected_delivery": "2024-01-05"
  }
```

#### Step 5: Test

**Test Conversation 1: Knowledge Base Query**
```
User: What's your return policy?
AI: Hello! Our return policy is as follows:
    - 7-day no-reason return (product unused)
    - Support pickup service (some regions)
    - Refund 1-3 business days to account
    Detailed policy can be found in [Help Center]. Any other questions?
```

**Test Conversation 2: Tool Calling**
```
User: Help me check logistics for order 20240101001
AI: [Calling check_order tool...]
    Your order has been shipped🚚
    Tracking number: SF1234567890
    Expected delivery: 2024-01-05
    You can track in real-time [here].
```

**Test Conversation 3: Emotion Recognition**
```
User: Why isn't my package here yet? Your efficiency is terrible!
AI: Very sorry to keep you waiting😔 I understand your anxiety.
    Let me immediately contact logistics specialist to expedite, and transfer you to human customer service.
    Please wait a moment, we'll handle your order with priority!
    [Trigger human transfer process]
```

#### Step 6: Publish

1. Click "Publish"
2. Select publish method:
   - **API:** Get API key, integrate into your App
   - **Web Chat:** Copy embed code, paste into website
   - **WeChat Official Account:** Configure Webhook (requires verified account)

**Embed Code Example:**
```html
<script src="https://api.dify.ai/embed.js" 
        data-app-id="YOUR_APP_ID"
        data-api-key="YOUR_API_KEY">
</script>
```

3. Paste into your website before `</body>`
4. Refresh page, chat bubble appears in bottom right ✅

### Total Time

- Prepare documents: 30 minutes
- Configure Dify: 20 minutes
- Test and optimize: 30 minutes
- **Total: About 1.5 hours**

Compared to traditional development (2-4 weeks), efficiency improved **100x**.

---

## One-Line Summary

**Mainstream AI orchestration platforms each have strengths:**

> Dify is **open-source all-rounder**, suitable for rapidly building any AI application; Coze is **ByteDance enterprise first choice**, strong multi-platform publishing and plugin ecosystem; n8n is **automation king**, connects all SaaS tools; Zapier is **non-technical person's paradise**, easy to use but expensive; FlowiseAI is **AI engineer's debugging console**, fine low-level control but complex—choosing the right tool is half the success.

## Next Steps

Now you've mastered the landscape and details of AI orchestration platforms, time to get hands-on:

1. **Register a Dify account** (or deploy locally), follow this chapter's case to build a customer service Bot
2. **Try Coze**, experience ByteDance's plugin ecosystem
3. **Install n8n**, build an automation workflow (e.g., RSS → AI rewrite → post to Twitter)
4. **Compare FlowiseAI**, understand LangChain's underlying principles

Next chapter, we'll explore **how AI programming empowers "everyone can code"**—when your product managers, designers, and operations can all build tools with AI, what will the world become?

---

::: tip 💡 Practical Assignment
Build a "personal knowledge base assistant" with Dify:
1. Upload your notes, articles, reading excerpts
2. Configure a conversation bot that can answer "what have I learned before"
3. Try adding web search tool, let AI search online for information
4. Deploy as webpage, share with friends

**Expected Time:** 2-3 hours  
**Gain:** Deep understanding of practical value of RAG, Prompt engineering, tool calling
:::

::: warning ⚠️ Pitfall Guide
1. **Don't over-rely on platform defaults**, especially Prompt and chunking strategy, need to optimize based on actual data
2. **Vector database choice matters**, free Chroma suitable for prototyping, production environment recommend Pinecone/Qdrant
3. **API costs accumulate**, GPT-4 is expensive (every 1M tokens $10-30), consider using GPT-4o-mini or domestic models
4. **Knowledge base isn't bigger is better**, document quality > quantity, garbage in garbage out
5. **Test and test again**, AI output is unstable, test edge cases thoroughly before launch
:::
