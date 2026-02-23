---
prev:
  text: '11.4 协议生态全景'
  link: '/zh/11-protocols/ecosystem'
next:
  text: '11.6 协议融合趋势'
  link: '/zh/11-protocols/convergence'
---

# 11.5 AG-UI 协议

## 协议栈里的"最后一公里"

我们已经有了 MCP 让 Agent 和工具对话，有了 A2A 让 Agent 之间互相交流。但等等——谁来帮 Agent 和**用户**说话？

这就像建了一座豪华别墅，装了智能家居系统，各种设备都能互相通信，结果发现忘了给主人装个遥控器。你只能站在门口对着房子喊："嘿，Siri！帮我开个灯！" 然后房子回应："抱歉，我只会跟其他房子聊天。"

AG-UI（Agent-User Interaction）协议就是来填补这个空白的——**它是协议栈里的"最后一公里"**，专门解决 AI Agent 如何与用户界面优雅互动的问题。

::: tip 协议栈的完整拼图
- **MCP**：Agent ↔ 工具（数据源、API）
- **A2A**：Agent ↔ Agent（多智能体协作）
- **AG-UI**：Agent ↔ 用户（前端界面交互）

三者合一，才是完整的 AI 应用生态！
:::

## 什么是 AG-UI？

AG-UI 是由 [CopilotKit](https://www.copilotkit.ai/) 团队开发的开放、轻量级、基于事件的协议，专门用于标准化 AI Agent 与用户界面之间的连接方式。

简单来说：**AG-UI 让你的 Agent 能够实时、双向地与前端 UI 对话**。

### 为什么需要 AG-UI？

在 AG-UI 出现之前，开发者要让 Agent 与 UI 交互，通常需要：

1. **手写 WebSocket/SSE 连接** —— 每个项目都重新造轮子
2. **自定义消息格式** —— 各家格式不兼容
3. **状态同步混乱** —— Agent 状态和 UI 状态经常打架
4. **缺乏标准化** —— 没有最佳实践可循

AG-UI 的出现就像是给这个混乱的局面制定了一套"通用语言"：

```
开发者A："我的 Agent 用 JSON-RPC 格式发消息。"
开发者B："我的用 gRPC。"
开发者C："我直接 HTTP 轮询。"
AG-UI："各位，用我这套标准吧，省心。"
```

## 核心概念

### 1. 基于事件的架构（Event-Based Architecture）

AG-UI 采用**事件流（Event Stream）**模式，所有的交互都是通过事件来传递的：

- **Agent → UI**：发送事件（消息、状态更新、工具调用结果）
- **UI → Agent**：发送事件（用户输入、确认、取消）

这种设计天然支持**实时流式响应**（Streaming），用户可以看到 Agent 的"思考过程"，而不是等半天才蹦出一个结果。

### 2. Server-Sent Events (SSE) 传输

AG-UI 使用 **SSE** 作为底层传输协议：

- **单向推送**：服务器可以持续向客户端推送事件
- **轻量级**：比 WebSocket 更简单，比 HTTP 轮询更高效
- **自动重连**：浏览器原生支持断线重连

```
传统 HTTP 请求：
用户："给我天气预报。"
Agent：（沉默 3 秒）"北京今天晴天。"

AG-UI + SSE：
用户："给我天气预报。"
Agent："正在查询天气 API..."
Agent："获取到数据，正在解析..."
Agent："北京今天晴天，气温 22°C。"
```

### 3. 标准化事件类型

AG-UI 定义了一套标准事件类型：

| 事件类型 | 说明 | 方向 |
|---------|------|------|
| `textMessage` | 文本消息（流式或完整） | Agent → UI |
| `toolCall` | 工具调用请求 | Agent → UI |
| `toolResult` | 工具执行结果 | UI → Agent |
| `stateUpdate` | 状态更新（如进度条） | Agent → UI |
| `actionRequest` | 请求用户确认 | Agent → UI |
| `actionResponse` | 用户确认/拒绝 | UI → Agent |
| `agentStart` | Agent 开始工作 | Agent → UI |
| `agentEnd` | Agent 完成工作 | Agent → UI |

### 4. 前端集成

AG-UI 提供了现成的 **React Hooks** 和组件，开发者可以快速集成：

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

## AG-UI 工作原理

下面用一个简化的架构图来说明 AG-UI 的工作流程：

```
┌─────────────────────────────────────────────────────────────┐
│                         用户界面 (UI)                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AG-UI Client SDK (TypeScript)                     │    │
│  │  • 监听 SSE 事件流                                  │    │
│  │  • 渲染消息/状态                                    │    │
│  │  • 发送用户输入                                     │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼────────────────────────────────────────┘
                    │
                    │ SSE (Server-Sent Events)
                    │ ↓ 事件流（textMessage, stateUpdate...）
                    │ ↑ HTTP POST（用户输入、确认）
                    │
┌───────────────────┼────────────────────────────────────────┐
│                   ▼                                         │
│              AG-UI Server                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  AG-UI Server SDK (Python/TypeScript)              │    │
│  │  • 管理事件流                                       │    │
│  │  • 路由消息到 Agent                                 │    │
│  │  • 广播 Agent 状态                                  │    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼────────────────────────────────────────┘
                    │
                    │ 内部调用
                    │
┌───────────────────▼────────────────────────────────────────┐
│                    AI Agent                                 │
│  • 接收用户输入                                             │
│  • 调用工具（通过 MCP？）                                   │
│  • 发送响应事件                                             │
│  • 更新状态（progress: 50%）                                │
└─────────────────────────────────────────────────────────────┘
```

### 典型交互流程

1. **用户发送消息**：UI 通过 HTTP POST 发送用户输入
2. **Agent 开始处理**：发送 `agentStart` 事件
3. **流式响应**：Agent 边思考边发送 `textMessage` 事件（SSE 流）
4. **工具调用**：Agent 需要调用工具时，发送 `toolCall` 事件
5. **UI 展示工具调用**：UI 显示"正在查询数据库..."
6. **返回结果**：工具执行完毕，发送 `toolResult` 事件
7. **最终响应**：Agent 发送完整答案，发送 `agentEnd` 事件

## 协议对比：MCP vs A2A vs AG-UI

| 维度 | MCP | A2A | AG-UI |
|------|-----|-----|-------|
| **连接对象** | Agent ↔ 工具 | Agent ↔ Agent | Agent ↔ 用户界面 |
| **主要用途** | 数据访问、API 调用 | 多智能体协作 | 用户交互、UI 更新 |
| **通信方式** | 请求-响应（JSON-RPC） | 异步消息传递 | 事件流（SSE） |
| **状态管理** | 无状态 | 分布式状态 | UI 状态同步 |
| **典型场景** | 读取文件、查询数据库 | Agent 委托任务 | 聊天界面、进度展示 |
| **流式支持** | ❌ 不支持 | ⚠️ 部分支持 | ✅ 原生支持 |
| **前端集成** | 不涉及 | 不涉及 | 提供 React 组件 |

::: tip 三剑客组合拳
一个完整的 AI 应用可能同时用到三种协议：
- **MCP**：Agent 通过 MCP 访问数据库和 API
- **A2A**：多个 Agent 通过 A2A 协作完成复杂任务
- **AG-UI**：Agent 通过 AG-UI 与用户实时交互

比如：用户在 UI 上问"帮我分析销售数据"，AG-UI 传递消息给 Agent，Agent 通过 A2A 委托给数据分析 Agent，数据分析 Agent 通过 MCP 查询数据库，最后结果通过 AG-UI 流式返回给用户。
:::

## 代码示例：简单 AG-UI 集成

### 后端（Python + FastAPI）

```python
from fastapi import FastAPI
from copilotkit import CopilotKit, Agent
from copilotkit.sse import sse_response

app = FastAPI()
copilot = CopilotKit()

@copilot.agent("assistant")
async def my_agent(message: str):
    """一个简单的 Agent"""
    # 发送开始事件
    yield {"type": "agentStart"}
    
    # 流式发送文本
    yield {"type": "textMessage", "content": "正在处理你的请求..."}
    
    # 模拟工具调用
    yield {
        "type": "toolCall",
        "tool": "database_query",
        "args": {"query": "SELECT * FROM users"}
    }
    
    # 模拟处理延迟
    import asyncio
    await asyncio.sleep(1)
    
    # 发送最终响应
    yield {
        "type": "textMessage",
        "content": f"你说了：{message}。我已经处理完了！"
    }
    
    # 发送结束事件
    yield {"type": "agentEnd"}

@app.post("/api/agent")
async def agent_endpoint(request: dict):
    return sse_response(copilot.handle(request))
```

### 前端（React + TypeScript）

```tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";

function App() {
  return (
    <CopilotKit runtimeUrl="/api/agent">
      <div style={{ height: "100vh" }}>
        <CopilotChat
          labels={{
            title: "AI 助手",
            placeholder: "问我任何问题...",
          }}
          onToolCall={(tool) => {
            console.log("Agent 正在调用工具:", tool);
          }}
        />
      </div>
    </CopilotKit>
  );
}

export default App;
```

### 效果

用户在界面输入："帮我查询用户列表"

界面实时显示：
```
🤖 正在处理你的请求...
🔧 正在调用工具：database_query
✅ 你说了：帮我查询用户列表。我已经处理完了！
```

所有这些更新都是**流式传输**的，用户可以实时看到 Agent 的工作进度。

## AG-UI 与 Generative UI（A2UI）

你可能听说过 **Generative UI**（生成式 UI）或者 **A2UI**（AI-to-UI）的概念——Agent 不仅返回文本，还能动态生成 UI 组件。

AG-UI 协议天然支持这种趋势！

### 传统聊天 vs Generative UI

**传统聊天**：
```
用户："给我看今天的股票行情。"
Agent："苹果股价 150 美元，涨幅 2%。微软..."
```

**Generative UI**：
```
用户："给我看今天的股票行情。"
Agent：（直接渲染一个实时股票图表组件）
┌───────────────────────────┐
│  📈 实时股票行情          │
│  ──────────────────────   │
│  AAPL  $150  ▲ 2%        │
│  MSFT  $380  ▲ 1.5%      │
│  [查看详情]               │
└───────────────────────────┘
```

### AG-UI 如何支持 Generative UI

AG-UI 允许 Agent 发送 **自定义组件事件**：

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

前端接收后，动态渲染对应的 React 组件：

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

::: tip AG-UI = A2UI 的基础设施
AG-UI 提供了标准化的事件传输机制，让 Generative UI 的实现变得简单。你可以把 AG-UI 看作是 A2UI 的"通信协议层"。
:::

## 实际应用场景

### 1. 客服聊天机器人

```
用户："我的订单什么时候发货？"
Agent：（查询订单系统）
Agent："你的订单 #12345 已于今天上午发货。"
Agent：（生成物流追踪组件）
┌───────────────────────────┐
│  📦 物流信息              │
│  2月22日 10:30 已发货     │
│  2月22日 14:20 运输中     │
│  [查看详细物流]           │
└───────────────────────────┘
```

### 2. 数据分析助手

```
用户："分析一下上个月的销售趋势。"
Agent："正在查询数据库..."
Agent："正在生成图表..."
Agent：（生成折线图组件 + 数据表格）
```

### 3. 代码助手（类似 GitHub Copilot）

```
用户："帮我重构这个函数。"
Agent："发现可优化点：重复代码、性能问题。"
Agent：（生成代码对比视图组件）
┌─────────────────────────────────┐
│  Before          →    After     │
│  for (let i...)  →    map(...)  │
│  [接受修改] [拒绝]              │
└─────────────────────────────────┘
```

## AG-UI 的生态系统

### 官方 SDK

- **TypeScript SDK**：`@copilotkit/sdk`（客户端 + 服务端）
- **Python SDK**：`copilotkit`（服务端）
- **React UI Kit**：`@copilotkit/react-ui`（现成的聊天组件）

### 框架集成

AG-UI 可以轻松集成到主流框架：

- **Next.js**：服务端 API Route + React 组件
- **FastAPI**：Python 后端
- **Express.js**：Node.js 后端
- **Django**：Python Web 框架

### 与其他协议的互操作

AG-UI 本身是**协议无关**的，你可以在 Agent 内部使用任何技术：

```python
@copilot.agent("my_agent")
async def my_agent(message: str):
    # 通过 MCP 访问工具
    mcp_client = MCPClient("sqlite")
    data = await mcp_client.call_tool("query", {"sql": "SELECT ..."})
    
    # 通过 A2A 委托给其他 Agent
    result = await a2a_client.send_message("data_analyst", data)
    
    # 通过 AG-UI 返回给用户
    yield {"type": "textMessage", "content": result}
```

## AG-UI 的未来展望

### 1. 更丰富的组件库

未来可能出现标准化的 **Agent UI Components**：

- `<AgentThinkingIndicator />` —— 标准化的"思考中"动画
- `<ToolCallVisualization />` —— 工具调用可视化
- `<MultiAgentCollaboration />` —— 多 Agent 协作视图

### 2. 跨平台支持

目前 AG-UI 主要针对 Web，未来可能扩展到：

- **移动端**：React Native、Flutter 支持
- **桌面端**：Electron、Tauri 支持
- **语音界面**：与 TTS/STT 集成

### 3. 标准化进程

AG-UI 目前还是 CopilotKit 团队主导的协议，但如果社区采纳，可能会像 MCP 一样成为事实标准。

想象一下：
```
"这个 Agent 支持 AG-UI 吗？"
"当然，所有现代 Agent 都支持 AG-UI。"
```

## 一句话总结

> **AG-UI 是让 AI Agent 与用户界面优雅对话的开放协议，通过事件流和标准化 SDK，让开发者能快速构建实时、交互式的 AI 应用——它是协议栈的"最后一公里"，也是 Generative UI 时代的基础设施。**

---

::: tip 延伸阅读
- [CopilotKit 官方文档](https://docs.copilotkit.ai/)
- [AG-UI GitHub 仓库](https://github.com/CopilotKit/CopilotKit)
- [Generative UI 设计指南](https://www.copilotkit.ai/blog/generative-ui)
:::

::: warning 注意
AG-UI 目前还在快速发展中，API 可能会有变动。建议关注官方文档获取最新信息。
:::
