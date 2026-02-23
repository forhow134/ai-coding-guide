---
prev:
  text: '11.5 AG-UI Protocol'
  link: '/11-protocols/ag-ui'
next:
  text: '12.1 RAG Basics'
  link: '/12-rag-memory/'
---

# 11.6 Protocol Convergence Trends

## Too Many Protocols? Don't Panic, They're Merging

If you felt confused looking at the AI Agent ecosystem in late 2024—MCP, A2A, ACP, AG-UI, ANP... so many protocols, which one should I use?—there's good news starting in 2025: **protocols are converging**.

Just like the browser wars eventually converged to web standards, and cloud providers eventually all support Kubernetes, the AI Agent ecosystem's protocol wars are rapidly moving toward reconciliation. It's not that one protocol "won," but rather they found their respective positions and began **working together**.

In this chapter we'll discuss:
- How ACP "disappeared" (actually merged into A2A)
- MCP's new evolution: remote servers, streaming HTTP, frontend MCP Apps
- A2A joins the Linux Foundation, W3C standardization discussions begin
- The emerging "protocol stack": MCP + A2A + AG-UI + ANP
- Predictions for 2026-2027

**This isn't the death of protocols, but their maturation**.

---

## ACP → A2A: IBM Bee AI's Strategic Shift

### The Birth and Demise of ACP

In late 2024, IBM Research open-sourced the **Bee AI Agent Framework** and launched **ACP (Agent Communication Protocol)** for structured communication between agents.

ACP's design was clear:
- JSON-RPC style request/response
- Support for streaming returns (`stream: true`)
- Built-in retry, timeout, and error handling
- Standardized tool invocation

But there was a problem: **A2A was doing the same thing**.

Anthropic's A2A was released earlier, had a larger community, and was already deployed in products like Notion, Asana, and Slack. The IBM team quickly realized: **rather than reinvent the wheel, join the standardization process**.

### January 2025: ACP Announces Merger into A2A

In January 2025, the IBM Bee AI team announced on GitHub:

> "After extensive discussion with the A2A community, we've decided to **merge ACP into A2A**. Our goal has always been interoperability, not fragmentation."

Specific actions:
1. **ACP repository archived**, documentation notes "merged into A2A"
2. **Bee AI framework changed to support A2A protocol**
3. IBM engineers joined the **A2A Working Group**, contributing retry, streaming, and other features

**Significance of this merger**:
- **Avoided protocol fragmentation**: If IBM insisted on ACP, the ecosystem would split into "Anthropic camp" and "IBM camp"
- **Functional complementarity**: ACP's streaming design and error retry mechanisms were absorbed into A2A specification
- **Enterprise endorsement**: IBM's participation gave A2A more enterprise trust

### Bee AI's New Position

After the merger, Bee AI is no longer a "protocol maker" but an **excellent A2A implementation**:
- Built-in A2A client/server
- Interoperates with Anthropic Claude, OpenAI GPT
- Provides enterprise deployment tools (Docker, Kubernetes Helm Charts)

**Lesson**: In the early stages of standardization, **protocol mergers are more valuable than protocol competition**.

---

## MCP Evolution: From Local to Remote, From Backend to Frontend

### Review: MCP 1.0 Limitations

When Anthropic released MCP in November 2024, it was primarily a **local tool protocol**:
- Stdio transport: MCP Server runs as a subprocess
- One-to-one connection: one Client corresponds to one Server
- Mainly used for Claude Desktop to connect local tools

But developers quickly discovered problems:
- **Cannot deploy remotely**: Each user must install MCP Server locally
- **Difficult to share**: Cannot be SaaS, can only distribute source code or binaries
- **Frontend cannot connect directly**: Web/mobile apps cannot directly call MCP Server

### MCP 2.0 Planning: Three Major Evolution Directions

In early 2025, Anthropic launched the **MCP 2.0 Working Group**, focusing on:

#### 1. **Remote MCP Servers**

**Goal**: Allow MCP Servers to be deployed as remote services.

**Solution**:
```typescript
// Client configuration
{
  "mcpServers": {
    "weather": {
      "transport": "sse",  // Server-Sent Events
      "url": "https://weather-mcp.example.com",
      "auth": {
        "type": "bearer",
        "token": "sk-..."
      }
    }
  }
}
```

**Transport methods**:
- **SSE (Server-Sent Events)**: Server push, suitable for notifications, log streams
- **WebSocket**: Bidirectional streaming, suitable for interactive tools
- **HTTP long polling**: Fallback solution

**Benefits**:
- SaaSification: Developers can deploy `mcp.example.com`, users connect directly
- Enterprise deployment: Companies can run MCP Gateway on internal networks, unified tool management
- Mobile-friendly: Mobile apps can call MCP via HTTPS

#### 2. **Streamable HTTP Transport**

**Problem**: Stdio transport doesn't support HTTP, can't pass through firewalls, can't load balance.

**Solution**:
```http
POST /mcp/v1/tools/call
Content-Type: application/json
Authorization: Bearer sk-...

{
  "method": "tools/call",
  "params": {
    "name": "search",
    "arguments": { "query": "AI news" }
  }
}
```

**Return streaming response**:
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

data: {"type": "progress", "message": "Searching..."}

data: {"type": "result", "content": [...]}

data: {"type": "done"}
```

**Difference from REST API**:
- Maintains MCP's **session management** (session_id)
- Supports **tool discovery** (list all available tools)
- Supports **Prompt templates**, **resource reading**

#### 3. **MCP Apps (Frontend Integration)**

**Most radical idea**: Let browsers/mobile apps directly become MCP Clients.

**Architecture**:
```
┌─────────────────┐
│  React App      │
│  (MCP Client)   │
└────────┬────────┘
         │ WebSocket/SSE
         ▼
┌─────────────────┐
│  MCP Gateway    │ ← Authentication, authorization, rate limiting
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
  [Server1] [Server2] [Server3] ...
```

**Frontend code example**:
```typescript
import { createMCPClient } from '@modelcontextprotocol/client-browser'

const client = await createMCPClient({
  transport: 'sse',
  url: 'https://mcp-gateway.example.com',
  auth: { bearer: userToken }
})

// List tools
const tools = await client.listTools()

// Call tool
const result = await client.callTool({
  name: 'create_calendar_event',
  arguments: { title: 'Meeting', time: '2026-02-23 14:00' }
})
```

**Use cases**:
- **No-code platforms**: Zapier, Make.com can directly drag MCP tools
- **Enterprise dashboards**: Admins operate internal tools in web interface
- **Mobile Agent Apps**: AI assistants on phones call cloud MCP tools

### Significance of MCP Evolution

MCP evolved from "Claude's local tool protocol" to **universal tool standardization layer**:
- **Developers**: Write tools once, run everywhere (local/cloud/browser)
- **Enterprises**: Unified tool gateway, connects all AI Agents
- **End users**: Web/mobile apps can also enjoy MCP ecosystem

---

## A2A Joins Linux Foundation: Moving Toward Neutral Governance

### February 2025 Announcement

In February 2025, Anthropic announced: **A2A protocol governance transferred to Linux Foundation**.

**Similar precedents**:
- **Kubernetes** (Google → CNCF)
- **GraphQL** (Facebook → GraphQL Foundation)
- **OpenTelemetry** (Multiple companies → CNCF)

**Why transfer?**
1. **Neutrality**: Avoid the "Anthropic's protocol" label, attract competitors to participate
2. **Enterprise trust**: Large companies are more willing to adopt "foundation standards" rather than "single vendor standards"
3. **Long-term maintenance**: Even if Anthropic adjusts strategy, A2A can develop independently

### A2A Working Group Members

Linux Foundation established **A2A Technical Steering Committee (TSC)**, initial members:
- **Anthropic** (initiator)
- **IBM** (Bee AI)
- **Microsoft** (Azure AI Agent Service)
- **Google** (Vertex AI Agents)
- **Notion** (first batch of product integration)
- **Slack** (enterprise collaboration scenarios)

**Independent contributors**:
- Authors of open-source frameworks like Chidori, LangChain, Haystack

### W3C Standardization Discussion

Further, Linux Foundation and **W3C (World Wide Web Consortium)** initiated discussions:

> "Should A2A become a **W3C Recommendation**, like HTTP, WebSocket, WebRTC?"

**Potential path**:
1. 2025: Linux Foundation hosting, rapid iteration
2. 2026: Submit to W3C as **Working Draft**
3. 2027: Become **Candidate Recommendation**
4. 2028: **W3C Recommendation** (formal standard)

**If successful**:
- A2A will become **browser native API** (`navigator.agents.send(...)`)
- All AI vendors will implement (similar to WebRTC)
- Interoperability thoroughly solved

---

## The Emerging Protocol Stack

### Layered Architecture

After a year of chaos, a clear **layered protocol stack** is emerging:

```
┌─────────────────────────────────────────┐
│  End User (Human User)                  │
└──────────────────┬──────────────────────┘
                   │ AG-UI Protocol
┌──────────────────▼──────────────────────┐
│  AI Agent (Claude, GPT, Gemini...)      │
└──────────────────┬──────────────────────┘
                   │ A2A Protocol
┌──────────────────▼──────────────────────┐
│  Other Agents (Specialized Agents)       │
└──────────────────┬──────────────────────┘
                   │ MCP Protocol
┌──────────────────▼──────────────────────┐
│  Tools & Data Sources (APIs, DBs...)    │
└─────────────────────────────────────────┘
```

**Layer responsibilities**:

| Protocol | Connects | Core Function | Typical Use Case |
|----------|---------|---------------|------------------|
| **AG-UI** | User ↔ Agent | Approval requests, feedback, UI controls | Claude Desktop, Web Agent |
| **A2A** | Agent ↔ Agent | Task delegation, state sync, collaboration | "Master Agent" calls "Expert Agents" |
| **MCP** | Agent ↔ Tool | Tool discovery, invocation, resource reading | Agent calls database, API, file system |
| **ANP** | Agent ↔ Internet | Decentralized discovery, trust chain | Find "Agent that can order food" |

### Key Insight: Complementary, Not Competitive

Early on, people thought "protocols will compete and eliminate," but actually:

**MCP and A2A are not competitors**:
- MCP focuses on **tool standardization**, letting Agents call external capabilities
- A2A focuses on **Agent collaboration**, letting multiple Agents cooperate to complete complex tasks

**Analogy**:
- MCP = **Function call convention** (like POSIX API)
- A2A = **Inter-process communication** (like D-Bus, RPC)
- AG-UI = **User interface protocol** (like X11, Wayland)

They **solve different problems and operate at different levels**.

### Practical Integration Example

A complete enterprise AI system might be built like this:

```
┌────────────────────────────────────────────┐
│  Web UI (AG-UI Protocol)                   │
│  - User chats with Agent in browser        │
│  - Agent requests approval, confirmation   │
└───────────────┬────────────────────────────┘
                │
┌───────────────▼────────────────────────────┐
│  Main Agent (Claude / GPT-4)               │
│  - Understand user intent                  │
│  - Plan tasks, decide which sub-Agents/tools│
└───────┬───────────────┬────────────────────┘
        │ A2A           │ MCP
        ▼               ▼
 ┌──────────────┐  ┌─────────────┐
 │ Code Agent   │  │ Weather API │
 │ (specialized)│  │ Calendar DB │
 └──────────────┘  └─────────────┘
```

**Real flow**:
1. User (AG-UI): "Check tomorrow's weather, if rain postpone meeting"
2. Main Agent (A2A) → Weather Agent: "Check tomorrow's weather"
3. Weather Agent (MCP) → Weather API: Call tool
4. Weather Agent (A2A) → Main Agent: "Will rain"
5. Main Agent (AG-UI) → User: "Tomorrow will rain, postpone meeting?"
6. User approves → Main Agent (MCP) → Calendar DB: Update meeting time

**Four protocols each play their role, seamlessly cooperating**.

---

## ANP: Agent Discovery for the Open Internet

### Problem: Closed Ecosystem Limitations

Current Agent systems are **closed**:
- Claude can only call MCP Servers you configured
- LangChain Agent can only use tools registered in your code
- Enterprise Agents can only access internal network APIs

**But the future should be open**:
- "Help me order a pizza" → Automatically discover nearby restaurants that support Agent
- "Translate this contract" → Find professional legal translation Agent
- "Analyze this dataset" → Connect to data analysis Agent

### ANP Protocol Design

**ANP (Agent Network Protocol)**, proposed by the open-source community (not yet led by major companies), aims for **decentralized Agent discovery**.

**Core concept**:
```yaml
# agent-manifest.yaml (published at https://example.com/.well-known/agent)
name: "Pizza Ordering Agent"
description: "Order pizza from our restaurant"
capabilities:
  - search_menu
  - place_order
  - track_delivery
protocols:
  - mcp
  - a2a
endpoints:
  mcp: "https://api.example.com/mcp"
  a2a: "https://api.example.com/a2a"
trust:
  verified_by: "TrustNetworkX"
  reputation_score: 4.8
```

**Discovery flow**:
1. User Agent queries **ANP Registry**: "Agent that can order pizza"
2. Registry returns candidate list (by location, rating, protocol support)
3. User Agent handshakes, negotiates, executes tasks with target Agent via A2A

**Analogy**:
- ANP = **DNS** (discover services)
- MCP/A2A = **HTTP/WebSocket** (communication protocols)

### Challenge: Trust and Security

Biggest risk of open Agent network: **How to trust unknown Agents?**

**Possible solutions**:
- **Trust network** (similar to SSL certificate system)
- **Sandbox execution** (Agents can only run in restricted environments)
- **Payment guarantee** (similar to Uber's rating + insurance mechanism)

**ANP is still early**, but the direction is clear: **Make Agents discoverable and accessible like websites**.

---

## 2026-2027 Predictions

### Short-term (2026)

1. **MCP Remote Servers become mainstream**
   - Most MCP Servers provide SaaS versions
   - Enterprises begin deploying MCP Gateway

2. **A2A lands in enterprises**
   - Enterprise software like Salesforce, ServiceNow begin supporting A2A
   - "Agent Orchestration Platforms" emerge

3. **AG-UI integrates into mainstream AI products**
   - ChatGPT, Gemini, Claude all support "user approval flows"
   - Mobile AI Apps standard include AG-UI

4. **Protocol interoperability demos**
   - "MCP + A2A + AG-UI" full-stack demos appear
   - Open-source frameworks (LangChain, Haystack) fully support three protocols

### Mid-term (2027)

1. **W3C standardization progresses**
   - A2A enters W3C Candidate Recommendation
   - Browsers begin experimental support for `navigator.agents` API

2. **ANP 0.5 released**
   - Supports basic decentralized discovery
   - Several AI companies pilot "public Agent marketplace"

3. **Protocol stack stabilizes**
   - MCP 2.0 officially released
   - A2A 1.0 officially released
   - AG-UI adopted as "recommended practice"

4. **New players join**
   - Apple launches Siri Agent Protocol (compatible with MCP/A2A)
   - Amazon Alexa supports A2A
   - Chinese vendors (Alibaba, Tencent) launch compatible implementations

### Long-term (2028+)

**Bold predictions**:
- **Agents become first-class citizens**: Just like "websites" are the basic unit of the Web, **"Agents" become the basic unit of the AI Internet**
- **Browsers have built-in Agent Runtime**: Chrome, Safari natively support running Agents
- **Decentralized Agent economy**: You can "hire" others' Agents, settled via blockchain
- **Protocols become "air"**: Just like no one cares about HTTP 1.1 vs 2.0 now, protocols become transparent infrastructure

---

## Advice for Developers

### What Should I Learn Now?

**2025 priorities**:
1. **Must learn**: MCP (tool standardization is fundamental)
2. **Recommended**: A2A (if building multi-Agent systems)
3. **Understand**: AG-UI (if building user products)
4. **Follow**: ANP (still too early, but worth tracking)

### How to Ensure Compatibility?

**Best practice**:
```python
# Layered architecture, protocols are replaceable
class AgentFramework:
    def __init__(self, 
                 tool_protocol="mcp",    # or "custom"
                 agent_protocol="a2a",   # or "custom"
                 ui_protocol="ag-ui"):   # or "custom"
        self.tools = ToolClient(tool_protocol)
        self.agents = AgentClient(agent_protocol)
        self.ui = UIClient(ui_protocol)
```

**Don't hardcode protocols**, use **adapter pattern**:
```typescript
interface ToolProtocol {
  listTools(): Promise<Tool[]>
  callTool(name: string, args: any): Promise<Result>
}

class MCPAdapter implements ToolProtocol { ... }
class CustomAdapter implements ToolProtocol { ... }

// Switch protocols by changing adapter
const tools: ToolProtocol = new MCPAdapter(...)
```

### Participate in Standardization

If you want to influence protocol evolution:
1. **Join GitHub Discussions**: MCP, A2A repositories have open discussions
2. **Contribute implementations**: Write SDKs, write demos, report bugs
3. **Join Working Groups**: Linux Foundation meetings are public (need to apply)
4. **Write blogs/tutorials**: Good practice articles influence specification design

**History proves**: Many features of web standards originally came from developer experiments and blogs.

---

## One-Liner Summary

> **"In 2025, AI Agent protocols moved from chaos to layers: MCP manages tools, A2A manages Agents, AG-UI manages users, ANP manages discovery—it's not who won, but everyone in their place."**

---

## Further Reading

- [ACP Merge Announcement](https://github.com/i-am-bee/acp) (archived repository)
- [MCP 2.0 Roadmap](https://github.com/modelcontextprotocol/specification/issues)
- [A2A Linux Foundation Press Release](https://www.linuxfoundation.org/)
- [ANP Whitepaper](https://agentnetwork.org/whitepaper) (community proposal)

---

**Next chapter**: We enter the "brain" of AI Agents—**RAG (Retrieval Augmented Generation)** and **memory systems**. Protocols solve "how to communicate," RAG solves "how to remember and retrieve".

Ready? Let's dive into memory! 🧠
