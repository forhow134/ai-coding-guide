<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { lang } = useData()
const isZh = computed(() => lang.value === 'zh-CN')
const prefix = computed(() => isZh.value ? '/zh' : '')

interface PageInfo {
  path: string
  en: string
  zh: string
}

const ch1: PageInfo[] = [
  { path: '/01-first-experience/', en: '1.1 Your First AI Conversation', zh: '1.1 你的第一次AI对话' },
  { path: '/01-first-experience/free-options', en: '1.2 Free Options & Zero-Cost Start', zh: '1.2 免费方案与零成本起步' },
]
const ch2: PageInfo[] = [
  { path: '/02-ai-landscape/', en: '2.1 AI Landscape', zh: '2.1 AI全景图' },
  { path: '/02-ai-landscape/model-providers', en: '2.2 Model Providers', zh: '2.2 主流模型提供商' },
  { path: '/02-ai-landscape/aggregators', en: '2.3 Aggregators & Gateways', zh: '2.3 聚合平台与网关' },
  { path: '/02-ai-landscape/local-deployment', en: '2.4 Local Deployment', zh: '2.4 本地模型部署' },
]
const ch3: PageInfo[] = [
  { path: '/03-llm-fundamentals/', en: '3.1 Tokens & Tokenization', zh: '3.1 Token与分词' },
  { path: '/03-llm-fundamentals/parameters', en: '3.2 Inference Parameters', zh: '3.2 推理参数详解' },
  { path: '/03-llm-fundamentals/reasoning-models', en: '3.3 Reasoning Models & CoT', zh: '3.3 推理模型与思考链' },
]
const ch4: PageInfo[] = [
  { path: '/04-prompt-engineering/', en: '4.1 Prompt Fundamentals', zh: '4.1 Prompt基础' },
  { path: '/04-prompt-engineering/advanced-techniques', en: '4.2 Advanced Techniques', zh: '4.2 进阶技巧' },
  { path: '/04-prompt-engineering/structured-output', en: '4.3 Structured Output', zh: '4.3 结构化输出' },
]
const ch5: PageInfo[] = [
  { path: '/05-ai-coding-tools/', en: '5.1 IDE Integrated Tools', zh: '5.1 IDE集成型工具' },
  { path: '/05-ai-coding-tools/terminal-tools', en: '5.2 Terminal Native Tools', zh: '5.2 终端原生工具' },
  { path: '/05-ai-coding-tools/cloud-ai', en: '5.3 Cloud AI Development', zh: '5.3 云端AI开发' },
  { path: '/05-ai-coding-tools/selection-guide', en: '5.4 Tool Selection Guide', zh: '5.4 工具选型指南' },
]
const ch6: PageInfo[] = [
  { path: '/06-context-engineering/', en: '6.1 Context Engineering Concepts', zh: '6.1 Context Engineering概念' },
  { path: '/06-context-engineering/agents-md', en: '6.2 AGENTS.md Standard', zh: '6.2 AGENTS.md标准' },
  { path: '/06-context-engineering/rules-skills', en: '6.3 Rules & Skills System', zh: '6.3 Rules & Skills体系' },
  { path: '/06-context-engineering/vibe-coding', en: '6.4 Vibe Coding & AI-First Flow', zh: '6.4 Vibe Coding与AI-First开发流' },
]
const ch7: PageInfo[] = [
  { path: '/07-function-calling/', en: '7.1 Function Calling Principles', zh: '7.1 Function Calling原理' },
  { path: '/07-function-calling/tool-use', en: '7.2 Tool Use in Practice', zh: '7.2 Tool Use实战' },
  { path: '/07-function-calling/orchestration', en: '7.3 Tool Orchestration & Fallback', zh: '7.3 工具编排与回退' },
]
const ch8: PageInfo[] = [
  { path: '/08-multimodal/', en: '8.1 Vision (Image Understanding)', zh: '8.1 Vision（图像理解）' },
  { path: '/08-multimodal/image-generation', en: '8.2 Image Generation', zh: '8.2 Image Generation' },
  { path: '/08-multimodal/speech-audio', en: '8.3 Speech & Audio', zh: '8.3 Speech & Audio' },
  { path: '/08-multimodal/video-realtime', en: '8.4 Video & Realtime', zh: '8.4 Video & Realtime' },
]
const ch9: PageInfo[] = [
  { path: '/09-ai-agents/', en: '9.1 Agent Core Concepts', zh: '9.1 Agent核心概念' },
  { path: '/09-ai-agents/react', en: '9.2 ReAct Pattern', zh: '9.2 ReAct模式' },
  { path: '/09-ai-agents/frameworks', en: '9.3 Agent Frameworks', zh: '9.3 Agent框架实战' },
  { path: '/09-ai-agents/computer-use', en: '9.4 Computer Use', zh: '9.4 Computer Use' },
]
const ch10: PageInfo[] = [
  { path: '/10-multi-agent/', en: '10.1 Multi-Agent Architecture', zh: '10.1 多Agent架构' },
  { path: '/10-multi-agent/handoff', en: '10.2 Sub-Agent & Handoff', zh: '10.2 Sub-Agent与Handoff' },
  { path: '/10-multi-agent/research-system', en: '10.3 Multi-Agent Research System', zh: '10.3 多Agent研究系统' },
]
const ch11: PageInfo[] = [
  { path: '/11-protocols/', en: '11.1 MCP Protocol', zh: '11.1 MCP协议详解' },
  { path: '/11-protocols/a2a', en: '11.2 A2A Protocol', zh: '11.2 A2A协议' },
  { path: '/11-protocols/anp', en: '11.3 ANP Protocol', zh: '11.3 ANP协议' },
  { path: '/11-protocols/ecosystem', en: '11.4 Protocol Ecosystem', zh: '11.4 协议生态全景' },
]
const ch12: PageInfo[] = [
  { path: '/12-rag-memory/', en: '12.1 RAG Fundamentals', zh: '12.1 RAG基础' },
  { path: '/12-rag-memory/embeddings', en: '12.2 Embeddings & Vector DB', zh: '12.2 Embedding与向量数据库' },
  { path: '/12-rag-memory/advanced-rag', en: '12.3 Advanced RAG', zh: '12.3 高级RAG' },
  { path: '/12-rag-memory/memory', en: '12.4 Memory & Storage', zh: '12.4 Memory & Storage' },
]
const ch13: PageInfo[] = [
  { path: '/13-production/', en: '13.1 Guardrails', zh: '13.1 Guardrails（护栏）' },
  { path: '/13-production/evaluation', en: '13.2 Evaluation', zh: '13.2 Evaluation（评估）' },
  { path: '/13-production/observability', en: '13.3 Observability', zh: '13.3 Observability（可观测）' },
  { path: '/13-production/cost-security', en: '13.4 Cost Optimization & Security', zh: '13.4 成本优化与安全' },
]
const ch14: PageInfo[] = [
  { path: '/14-practice/', en: '14.1 Knowledge Base Q&A', zh: '14.1 内部知识库Q&A系统' },
  { path: '/14-practice/code-review', en: '14.2 AI Code Review Assistant', zh: '14.2 AI Code Review助手' },
  { path: '/14-practice/ops-assistant', en: '14.3 IT Ops Assistant', zh: '14.3 IT运维智能助手' },
  { path: '/14-practice/team-toolchain', en: '14.4 Team AI Toolchain', zh: '14.4 团队AI工具链搭建' },
]
const appendixPages: PageInfo[] = [
  { path: '/appendix/', en: 'A. Glossary', zh: 'A. 术语表' },
  { path: '/appendix/tech-radar', en: 'B. Tech Radar', zh: 'B. 技术雷达' },
  { path: '/appendix/resources', en: 'C. Resources', zh: 'C. 资源索引' },
  { path: '/appendix/faq', en: 'D. FAQ', zh: 'D. FAQ' },
]

const allPages: PageInfo[] = [
  ...ch1, ...ch2, ...ch3, ...ch4, ...ch5, ...ch6,
  ...ch7, ...ch8, ...ch9, ...ch10, ...ch11, ...ch12,
  ...ch13, ...ch14, ...appendixPages,
]

const chapterMap: Record<string, PageInfo[]> = {
  'Ch1': ch1, 'Ch2': ch2, 'Ch3': ch3, 'Ch4': ch4,
  'Ch5': ch5, 'Ch6': ch6, 'Ch7': ch7, 'Ch8': ch8,
  'Ch9': ch9, 'Ch10': ch10, 'Ch11': ch11, 'Ch12': ch12,
  'Ch13': ch13, 'Ch14': ch14,
  'Ch6.4': [ch6[3]],
  'Ch11.4': [ch11[3]],
  'Ch13.4': [ch13[3]],
  'Ch14.1': [ch14[0]],
  'Ch14.3': [ch14[2]],
  'Ch14.4': [ch14[3]],
}

interface RoleDef {
  en: string
  zh: string
  icon: string
  steps: string[]
}

const roleDefs: Record<string, RoleDef> = {
  backend: { en: 'Backend Developer', zh: '后端开发者', icon: '⚙️', steps: ['Ch1', 'Ch3', 'Ch4', 'Ch7', 'Ch9', 'Ch12', 'Ch13', 'Ch14.1'] },
  frontend: { en: 'Frontend Developer', zh: '前端开发者', icon: '🎨', steps: ['Ch1', 'Ch4', 'Ch5', 'Ch6', 'Ch8', 'Ch14.4'] },
  devops: { en: 'DevOps / SRE', zh: '运维 / SRE', icon: '🔧', steps: ['Ch1', 'Ch4', 'Ch5', 'Ch9', 'Ch11', 'Ch13', 'Ch14.3'] },
  manager: { en: 'Tech Manager', zh: '技术管理者', icon: '📊', steps: ['Ch1', 'Ch5', 'Ch6.4', 'Ch11.4', 'Ch13.4', 'Ch14.4'] },
}

function expandRole(steps: string[]): PageInfo[] {
  return steps.flatMap(s => chapterMap[s] || [])
}

function norm(p: string): string {
  return p.replace(/^\/zh/, '').replace(/\/+$/, '') || '/'
}

const currentRole = ref<string | null>(null)

function readRole() {
  try {
    currentRole.value = sessionStorage.getItem('learningRole')
  } catch {
    currentRole.value = null
  }
}

function clearRole() {
  try {
    sessionStorage.removeItem('learningRole')
  } catch {}
  currentRole.value = null
}

const rolePageList = computed(() => {
  if (!currentRole.value || !roleDefs[currentRole.value]) return null
  return expandRole(roleDefs[currentRole.value].steps)
})

function findIndex(pages: PageInfo[]): number {
  const n = norm(route.path)
  return pages.findIndex(p => norm(p.path) === n)
}

const roleIndex = computed(() => rolePageList.value ? findIndex(rolePageList.value) : -1)
const isOnRolePath = computed(() => roleIndex.value >= 0)

const activeList = computed(() => isOnRolePath.value ? rolePageList.value! : allPages)
const activeIndex = computed(() => isOnRolePath.value ? roleIndex.value : findIndex(allPages))

const prevPage = computed(() => activeIndex.value > 0 ? activeList.value[activeIndex.value - 1] : null)
const nextPage = computed(() =>
  activeIndex.value >= 0 && activeIndex.value < activeList.value.length - 1
    ? activeList.value[activeIndex.value + 1]
    : null
)

const showNav = computed(() => activeIndex.value >= 0 && (prevPage.value || nextPage.value))

const roleInfo = computed(() => {
  if (!isOnRolePath.value || !currentRole.value) return null
  const def = roleDefs[currentRole.value]
  return {
    icon: def.icon,
    name: isZh.value ? def.zh : def.en,
    step: roleIndex.value + 1,
    total: rolePageList.value!.length,
  }
})

function label(p: PageInfo) {
  return isZh.value ? p.zh : p.en
}

function href(p: PageInfo) {
  return prefix.value + p.path
}

onMounted(readRole)
watch(() => route.path, readRole)
</script>

<template>
  <div v-if="showNav" class="pnav">
    <div v-if="roleInfo" class="pnav-role">
      <span class="pnav-role-info">
        {{ roleInfo.icon }} {{ roleInfo.name }}
        <span class="pnav-role-step">
          · {{ isZh ? `${roleInfo.step} / ${roleInfo.total}` : `Step ${roleInfo.step} of ${roleInfo.total}` }}
        </span>
      </span>
      <button class="pnav-role-exit" @click="clearRole" :title="isZh ? '退出角色路径' : 'Exit role path'">✕</button>
    </div>
    <nav class="pnav-links">
      <a v-if="prevPage" :href="href(prevPage)" class="pnav-link pnav-prev">
        <span class="pnav-dir">{{ isZh ? '← 上一节' : '← Previous' }}</span>
        <span class="pnav-title">{{ label(prevPage) }}</span>
      </a>
      <span v-else class="pnav-link pnav-placeholder" />
      <a v-if="nextPage" :href="href(nextPage)" class="pnav-link pnav-next">
        <span class="pnav-dir">{{ isZh ? '下一节 →' : 'Next →' }}</span>
        <span class="pnav-title">{{ label(nextPage) }}</span>
      </a>
      <span v-else class="pnav-link pnav-placeholder" />
    </nav>
  </div>
</template>
