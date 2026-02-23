---
prev:
  text: '11.4 Protocol Ecosystem Landscape'
  link: '/11-protocols/ecosystem'
next:
  text: '11.6 Protocol Convergence Trends'
  link: '/11-protocols/convergence'
---

# 11.5 AG-UI Protocol

## The "Last Mile" in the Protocol Stack

We already have MCP for Agents to talk to tools, and A2A for Agents to communicate with each other. But wait — who helps Agents talk to **users**?

It's like building a luxury villa with a smart home system where all devices can communicate with each other, only to realize you forgot to give the owner a remote control. You can only stand at the door and shout: "Hey, Siri! Turn on the lights!" And the house responds: "Sorry, I only chat with other houses."

AG-UI (Agent-User Interaction) protocol fills this gap — **it's the "last mile" in the protocol stack**, specifically solving how AI Agents elegantly interact with user interfaces.

::: tip The Complete Protocol Stack Puzzle
- **MCP**: Agent ↔ Tools (data sources, APIs)
- **A2A**: Agent ↔ Agent (multi-agent collaboration)
- **AG-UI**: Agent ↔ User (frontend interface interaction)

All three together form a complete AI application ecosystem!
:::

## What is AG-UI?

AG-UI is an open, lightweight, event-based protocol developed by the [CopilotKit](https://www.copilotkit.ai/) team, specifically designed to standardize how AI Agents connect with user interfaces.

Simply put: **AG-UI enables your Agent to have real-time, bidirectional conversations with the frontend UI**.

### Why Do We Need AG-UI?

Before AG-UI appeared, developers who wanted Agents to interact with UIs typically had to:

1. **Hand-write WebSocket/SSE connections** — Reinventing the wheel for every project
2. **Custom message formats** — Everyone's format incompatible
3. **Chaotic state synchronization** — Agent state and UI state constantly fighting
4. **Lack of standardization** — No best practices to follow

AG-UI's emergence is like establishing a "universal language" for this chaos:

```
Developer A: "My Agent sends messages in JSON-RPC format."
Developer B: "Mine uses gRPC."
Developer C: "I just poll HTTP directly."
AG-UI: "Everyone, use my standard, peace of mind."
```

## Core Concepts

### 1. Event-Based Architecture

AG-UI adopts an **Event Stream** pattern where all interactions are transmitted through events:

- **Agent → UI**: Send events (messages, state updates, tool call results)
- **UI → Agent**: Send events (user input, confirmations, cancellations)

This design naturally supports **real-time streaming responses** — users can see the Agent's "thinking process" instead of waiting forever for a result.

### 2. Server-Sent Events (SSE) Transport

AG-UI uses **SSE** as the underlying transport protocol:

- **Unidirectional push**: Server can continuously push events to client
- **Lightweight**: Simpler than WebSocket, more efficient than HTTP polling
- **Auto-reconnect**: Browser natively supports disconnection recovery

```
Traditional HTTP request:
User: "Give me weather forecast."
Agent: (silence for 3 seconds) "Beijing is sunny today."

AG-UI + SSE:
User: "Give me weather forecast."
Agent: "Querying weather API..."
Agent: "Got data, parsing..."
Agent: "Beijing is sunny today, 22°C."
```

### 3. Standardized Event Types

AG-UI defines a set of standard event types:

| Event Type | Description | Direction |
|-----------|-------------|-----------|
| `textMessage` | Text message (streaming or complete) | Agent → UI |
| `toolCall` | Tool call request | Agent → UI |
| `toolResult` | Tool execution result | UI → Agent |
| `stateUpdate` | State update (like progress bar) | Agent → UI |
| `actionRequest` | Request user confirmation | Agent → UI |
| `actionResponse` | User confirm/reject | UI → Agent |
| `agentStart` | Agent starts working | Agent → UI |
| `agentEnd` | Agent finishes work | Agent → UI |

### 4. Frontend Integration

AG-UI provides ready-made **React Hooks** and components for quick integration:

```tsx
import { useAgentUI } from '@copilotkit/react-ui';

function MyAgentChat() {
  const { messages, sendMessage, isAgentThinking } = useAgentUI({
    agentEndpoint: '/api/agent'
  });

  return (
    <div>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      {isAgentThinking && <ThinkingIndicator />}
    </div>
  );
}
```

## How AG-UI Works

Here's a simplified architecture diagram illustrating AG-UI's workflow:

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface (UI)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AG-UI Client SDK (TypeScript)                     │    │
│  │  • Listen to SSE event stream                      │    │
│  │  • Render messages/state                           │    │
│  │  • Send user input                                 │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼────────────────────────────────────────┘
                    │
                    │ SSE (Server-Sent Events)
                    │ ↓ Event stream (textMessage, stateUpdate...)
                    │ ↑ HTTP POST (user input, confirmations)
                    │
┌───────────────────┼────────────────────────────────────────┐
│                   ▼                                         │
│              AG-UI Server                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AG-UI Server SDK (Python/TypeScript)              │    │
│  │  • Manage event stream                             │    │
│  │  • Route messages to Agent                         │    │
│  │  • Broadcast Agent state                           │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼────────────────────────────────────────┘
                    │
                    │ Internal call
                    │
┌───────────────────▼────────────────────────────────────────┐
│                    AI Agent                                 │
│  • Receive user input                                      │
│  • Call tools (via MCP?)                                   │
│  • Send response events                                    │
│  • Update state (progress: 50%)                            │
└─────────────────────────────────────────────────────────────┘
```

### Typical Interaction Flow

1. **User sends message**: UI sends user input via HTTP POST
2. **Agent starts processing**: Sends `agentStart` event
3. **Streaming response**: Agent sends `textMessage` events while thinking (SSE stream)
4. **Tool call**: When Agent needs a tool, sends `toolCall` event
5. **UI shows tool call**: UI displays "Querying database..."
6. **Return result**: Tool execution complete, sends `toolResult` event
7. **Final response**: Agent sends complete answer, sends `agentEnd` event

## Protocol Comparison: MCP vs A2A vs AG-UI

| Dimension | MCP | A2A | AG-UI |
|-----------|-----|-----|-------|
| **Connection Target** | Agent ↔ Tools | Agent ↔ Agent | Agent ↔ User Interface |
| **Main Purpose** | Data access, API calls | Multi-agent collaboration | User interaction, UI updates |
| **Communication** | Request-response (JSON-RPC) | Async messaging | Event stream (SSE) |
| **State Management** | Stateless | Distributed state | UI state sync |
| **Typical Scenarios** | Read files, query DB | Agent delegates tasks | Chat interface, progress display |
| **Streaming Support** | ❌ Not supported | ⚠️ Partial support | ✅ Native support |
| **Frontend Integration** | Not applicable | Not applicable | Provides React components |

::: tip Three Musketeers Combo
A complete AI app might use all three protocols:
- **MCP**: Agent accesses DB and APIs via MCP
- **A2A**: Multiple Agents collaborate via A2A to complete complex tasks
- **AG-UI**: Agent interacts with user in real-time via AG-UI

For example: User asks on UI "Help me analyze sales data", AG-UI passes message to Agent, Agent delegates via A2A to data analysis Agent, data analysis Agent queries DB via MCP, final result streams back to user via AG-UI.
:::

## Code Example: Simple AG-UI Integration

### Backend (Python + FastAPI)

```python
from fastapi import FastAPI
from copilotkit import CopilotKit, Agent
from copilotkit.sse import sse_response

app = FastAPI()
copilot = CopilotKit()

@copilot.agent("assistant")
async def my_agent(message: str):
    """A simple Agent"""
    # Send start event
    yield {"type": "agentStart"}
    
    # Stream text
    yield {"type": "textMessage", "content": "Processing your request..."}
    
    # Simulate tool call
    yield {
        "type": "toolCall",
        "tool": "database_query",
        "args": {"query": "SELECT * FROM users"}
    }
    
    # Simulate processing delay
    import asyncio
    await asyncio.sleep(1)
    
    # Send final response
    yield {
        "type": "textMessage",
        "content": f"You said: {message}. I've processed it!"
    }
    
    # Send end event
    yield {"type": "agentEnd"}

@app.post("/api/agent")
async def agent_endpoint(request: dict):
    return sse_response(copilot.handle(request))
```

### Frontend (React + TypeScript)

```tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";

function App() {
  return (
    <CopilotKit runtimeUrl="/api/agent">
      <div style=\{\{ height: "100vh" }}>
        <CopilotChat
          labels=\{\{
            title: "AI Assistant",
            placeholder: "Ask me anything...",
          }}
          onToolCall={(tool) => {
            console.log("Agent calling tool:", tool);
          }}
        />
      </div>
    </CopilotKit>
  );
}

export default App;
```

### Effect

User inputs on interface: "Help me query user list"

Interface displays in real-time:
```
🤖 Processing your request...
🔧 Calling tool: database_query
✅ You said: Help me query user list. I've processed it!
```

All these updates are **streaming**, users can see Agent's work progress in real-time.

## AG-UI & Generative UI (A2UI)

You may have heard of **Generative UI** or **A2UI** (AI-to-UI) — where Agents don't just return text, but dynamically generate UI components.

AG-UI protocol naturally supports this trend!

### Traditional Chat vs Generative UI

**Traditional Chat**:
```
User: "Show me today's stock market."
Agent: "Apple stock $150, up 2%. Microsoft..."
```

**Generative UI**:
```
User: "Show me today's stock market."
Agent: (directly renders a real-time stock chart component)
┌───────────────────────────┐
│  📈 Real-time Stock Market │
│  ──────────────────────   │
│  AAPL  $150  ▲ 2%        │
│  MSFT  $380  ▲ 1.5%      │
│  [View Details]           │
└───────────────────────────┘
```

### How AG-UI Supports Generative UI

AG-UI allows Agents to send **custom component events**:

```python
yield {
    "type": "component",
    "component": "StockChart",
    "props": {
        "symbols": ["AAPL", "MSFT"],
        "range": "1d"
    }
}
```

Frontend receives and dynamically renders the corresponding React component:

```tsx
const componentMap = {
  StockChart: StockChart,
  WeatherWidget: WeatherWidget,
  // ...
};

function MessageRenderer({ event }) {
  if (event.type === "component") {
    const Component = componentMap[event.component];
    return <Component {...event.props} />;
  }
  return <TextMessage>{event.content}</TextMessage>;
}
```

::: tip AG-UI = A2UI's Infrastructure
AG-UI provides a standardized event transport mechanism, making Generative UI implementation simple. Think of AG-UI as the "communication protocol layer" for A2UI.
:::

## Real-World Application Scenarios

### 1. Customer Service Chatbot

```
User: "When will my order ship?"
Agent: (Query order system)
Agent: "Your order #12345 shipped this morning."
Agent: (Generate logistics tracking component)
┌───────────────────────────┐
│  📦 Logistics Info         │
│  Feb 22 10:30 Shipped      │
│  Feb 22 14:20 In Transit   │
│  [View Detailed Tracking]  │
└───────────────────────────┘
```

### 2. Data Analysis Assistant

```
User: "Analyze last month's sales trends."
Agent: "Querying database..."
Agent: "Generating chart..."
Agent: (Generate line chart component + data table)
```

### 3. Code Assistant (like GitHub Copilot)

```
User: "Help me refactor this function."
Agent: "Found optimization points: duplicate code, performance issues."
Agent: (Generate code comparison view component)
┌─────────────────────────────────┐
│  Before          →    After     │
│  for (let i...)  →    map(...)  │
│  [Accept] [Reject]              │
└─────────────────────────────────┘
```

## AG-UI Ecosystem

### Official SDKs

- **TypeScript SDK**: `@copilotkit/sdk` (client + server)
- **Python SDK**: `copilotkit` (server)
- **React UI Kit**: `@copilotkit/react-ui` (ready-made chat components)

### Framework Integration

AG-UI easily integrates into mainstream frameworks:

- **Next.js**: Server API Route + React components
- **FastAPI**: Python backend
- **Express.js**: Node.js backend
- **Django**: Python web framework

### Interoperability with Other Protocols

AG-UI itself is **protocol-agnostic**, you can use any tech inside the Agent:

```python
@copilot.agent("my_agent")
async def my_agent(message: str):
    # Access tools via MCP
    mcp_client = MCPClient("sqlite")
    data = await mcp_client.call_tool("query", {"sql": "SELECT ..."})
    
    # Delegate to other Agents via A2A
    result = await a2a_client.send_message("data_analyst", data)
    
    # Return to user via AG-UI
    yield {"type": "textMessage", "content": result}
```

## AG-UI's Future Outlook

### 1. Richer Component Library

Future may see standardized **Agent UI Components**:

- `<AgentThinkingIndicator />` — Standardized "thinking" animation
- `<ToolCallVisualization />` — Tool call visualization
- `<MultiAgentCollaboration />` — Multi-Agent collaboration view

### 2. Cross-Platform Support

Currently AG-UI mainly targets Web, may expand to:

- **Mobile**: React Native, Flutter support
- **Desktop**: Electron, Tauri support
- **Voice Interface**: Integration with TTS/STT

### 3. Standardization Process

AG-UI is currently a CopilotKit team-led protocol, but if community adopts, may become a de facto standard like MCP.

Imagine:
```
"Does this Agent support AG-UI?"
"Of course, all modern Agents support AG-UI."
```

## One-Sentence Summary

> **AG-UI is an open protocol that enables AI Agents to elegantly converse with user interfaces; through event streams and standardized SDKs, developers can quickly build real-time, interactive AI applications — it's the "last mile" in the protocol stack, and the infrastructure for the Generative UI era.**

---

::: tip Extended Reading
- [CopilotKit Official Docs](https://docs.copilotkit.ai/)
- [AG-UI GitHub Repo](https://github.com/CopilotKit/CopilotKit)
- [Generative UI Design Guide](https://www.copilotkit.ai/blog/generative-ui)
:::

::: warning Note
AG-UI is still rapidly evolving, API may change. Recommend following official docs for latest info.
:::
