<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isZh = computed(() => lang.value === 'zh-CN')
const prefix = computed(() => isZh.value ? '/zh' : '')

const activeRole = ref('backend')

interface Step {
  id: string
  en: string
  zh: string
  link: string
}

const allSteps: Record<string, Step> = {
  'Ch1': { id: 'Ch1', en: 'Ch1: Experience AI', zh: '第1章 体验AI', link: '/01-first-experience/' },
  'Ch3': { id: 'Ch3', en: 'Ch3: LLM Fundamentals', zh: '第3章 LLM原理', link: '/03-llm-fundamentals/' },
  'Ch4': { id: 'Ch4', en: 'Ch4: Prompt Engineering', zh: '第4章 Prompt', link: '/04-prompt-engineering/' },
  'Ch5': { id: 'Ch5', en: 'Ch5: AI Coding Tools', zh: '第5章 AI编程工具', link: '/05-ai-coding-tools/' },
  'Ch6': { id: 'Ch6', en: 'Ch6: Context Engineering', zh: '第6章 Context Eng.', link: '/06-context-engineering/' },
  'Ch6.4': { id: 'Ch6.4', en: 'Ch6.4: Vibe Coding', zh: '第6.4节 Vibe Coding', link: '/06-context-engineering/vibe-coding' },
  'Ch7': { id: 'Ch7', en: 'Ch7: Function Calling', zh: '第7章 Function Calling', link: '/07-function-calling/' },
  'Ch8': { id: 'Ch8', en: 'Ch8: Multimodal AI', zh: '第8章 多模态', link: '/08-multimodal/' },
  'Ch9': { id: 'Ch9', en: 'Ch9: AI Agent', zh: '第9章 AI Agent', link: '/09-ai-agents/' },
  'Ch11': { id: 'Ch11', en: 'Ch11: MCP/A2A/ANP', zh: '第11章 协议', link: '/11-protocols/' },
  'Ch11.4': { id: 'Ch11.4', en: 'Ch11.4: Protocol Ecosystem', zh: '第11.4节 协议生态', link: '/11-protocols/ecosystem' },
  'Ch12': { id: 'Ch12', en: 'Ch12: RAG & Memory', zh: '第12章 RAG & 记忆', link: '/12-rag-memory/' },
  'Ch13': { id: 'Ch13', en: 'Ch13: Production', zh: '第13章 生产化', link: '/13-production/' },
  'Ch13.4': { id: 'Ch13.4', en: 'Ch13.4: Cost & Security', zh: '第13.4节 成本与安全', link: '/13-production/cost-security' },
  'Ch14.1': { id: 'Ch14.1', en: 'Ch14.1: Knowledge Base', zh: '第14.1节 知识库', link: '/14-practice/' },
  'Ch14.3': { id: 'Ch14.3', en: 'Ch14.3: Ops Assistant', zh: '第14.3节 运维助手', link: '/14-practice/ops-assistant' },
  'Ch14.4': { id: 'Ch14.4', en: 'Ch14.4: Team Toolchain', zh: '第14.4节 团队工具链', link: '/14-practice/team-toolchain' },
}

interface Role {
  key: string
  en: string
  zh: string
  icon: string
  color: string
  stepKeys: string[]
}

const roles: Role[] = [
  {
    key: 'backend', en: 'Backend Developer', zh: '后端开发者', icon: '⚙️', color: '#3b82f6',
    stepKeys: ['Ch1', 'Ch3', 'Ch4', 'Ch7', 'Ch9', 'Ch12', 'Ch13', 'Ch14.1'],
  },
  {
    key: 'frontend', en: 'Frontend Developer', zh: '前端开发者', icon: '🎨', color: '#8b5cf6',
    stepKeys: ['Ch1', 'Ch4', 'Ch5', 'Ch6', 'Ch8', 'Ch14.4'],
  },
  {
    key: 'devops', en: 'DevOps / SRE', zh: '运维 / SRE', icon: '🔧', color: '#10b981',
    stepKeys: ['Ch1', 'Ch4', 'Ch5', 'Ch9', 'Ch11', 'Ch13', 'Ch14.3'],
  },
  {
    key: 'manager', en: 'Tech Manager', zh: '技术管理者', icon: '📊', color: '#f59e0b',
    stepKeys: ['Ch1', 'Ch5', 'Ch6.4', 'Ch11.4', 'Ch13.4', 'Ch14.4'],
  },
]

const currentRole = computed(() => roles.find(r => r.key === activeRole.value)!)

const currentSteps = computed(() =>
  currentRole.value.stepKeys.map(k => allSteps[k]).filter(Boolean)
)

function onStepClick() {
  try {
    sessionStorage.setItem('learningRole', activeRole.value)
  } catch {}
}
</script>

<template>
  <div class="rp-container">
    <div class="rp-tabs">
      <button
        v-for="role in roles"
        :key="role.key"
        :class="['rp-tab', { 'rp-tab-active': activeRole === role.key }]"
        :style="activeRole === role.key ? { '--rp-active-color': role.color } as any : {}"
        @click="activeRole = role.key"
      >
        <span class="rp-tab-icon">{{ role.icon }}</span>
        <span class="rp-tab-text">{{ isZh ? role.zh : role.en }}</span>
      </button>
    </div>

    <div class="rp-path-scroll">
      <div class="rp-path" :style="{ '--rp-color': currentRole.color } as any">
        <template v-for="(step, i) in currentSteps" :key="step.id">
          <div v-if="i > 0" class="rp-connector">
            <svg width="40" height="20" viewBox="0 0 40 20">
              <line x1="0" y1="10" x2="30" y2="10" stroke="currentColor" stroke-width="2" />
              <polygon points="30,5 40,10 30,15" fill="currentColor" />
            </svg>
          </div>
          <a :href="prefix + step.link" class="rp-step" @click="onStepClick">
            <span class="rp-step-num">{{ i + 1 }}</span>
            <span class="rp-step-label">{{ isZh ? step.zh : step.en }}</span>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
