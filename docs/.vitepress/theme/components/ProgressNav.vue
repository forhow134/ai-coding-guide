<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { lang } = useData()
const hoveredPart = ref<number | null>(null)
const scrollProgress = ref(0)
const isMobile = ref(false)

const isZh = computed(() => lang.value === 'zh-CN')
const prefix = computed(() => isZh.value ? '/zh' : '')

interface Chapter {
  en: string
  zh: string
  link: string
}

interface Part {
  id: string
  icon: string
  en: string
  zh: string
  pathPrefixes: string[]
  chapters: Chapter[]
}

const parts: Part[] = [
  {
    id: 'getting-started', icon: '🚀', en: 'Getting Started', zh: '入门篇',
    pathPrefixes: ['/01-first-experience', '/02-ai-landscape', '/03-llm-fundamentals', '/04-prompt-engineering'],
    chapters: [
      { en: 'Ch1: Experience AI in 3 Min', zh: '第1章 3分钟体验AI', link: '/01-first-experience/' },
      { en: 'Ch2: AI Landscape', zh: '第2章 AI全景与模型平台', link: '/02-ai-landscape/' },
      { en: 'Ch3: LLM Fundamentals', zh: '第3章 LLM核心原理', link: '/03-llm-fundamentals/' },
      { en: 'Ch4: Prompt Engineering', zh: '第4章 Prompt Engineering', link: '/04-prompt-engineering/' },
    ],
  },
  {
    id: 'tools', icon: '🛠️', en: 'Tools', zh: '工具篇',
    pathPrefixes: ['/05-ai-coding-tools', '/06-context-engineering'],
    chapters: [
      { en: 'Ch5: AI Coding Tools', zh: '第5章 AI编程工具', link: '/05-ai-coding-tools/' },
      { en: 'Ch6: Context Engineering', zh: '第6章 Context Engineering', link: '/06-context-engineering/' },
    ],
  },
  {
    id: 'capabilities', icon: '⚡', en: 'Capabilities', zh: '能力篇',
    pathPrefixes: ['/07-function-calling', '/08-multimodal', '/09-ai-agents', '/10-multi-agent'],
    chapters: [
      { en: 'Ch7: Function Calling', zh: '第7章 Function Calling', link: '/07-function-calling/' },
      { en: 'Ch8: Multimodal AI', zh: '第8章 多模态AI', link: '/08-multimodal/' },
      { en: 'Ch9: AI Agent', zh: '第9章 AI Agent', link: '/09-ai-agents/' },
      { en: 'Ch10: Multi-Agent', zh: '第10章 Multi-Agent', link: '/10-multi-agent/' },
    ],
  },
  {
    id: 'ecosystem', icon: '🌐', en: 'Ecosystem', zh: '生态篇',
    pathPrefixes: ['/11-protocols', '/12-rag-memory'],
    chapters: [
      { en: 'Ch11: MCP / A2A / ANP', zh: '第11章 MCP / A2A / ANP', link: '/11-protocols/' },
      { en: 'Ch12: RAG & Memory', zh: '第12章 RAG & 记忆', link: '/12-rag-memory/' },
    ],
  },
  {
    id: 'production', icon: '🏭', en: 'Production', zh: '生产篇',
    pathPrefixes: ['/13-production'],
    chapters: [
      { en: 'Ch13: Production', zh: '第13章 生产化', link: '/13-production/' },
    ],
  },
  {
    id: 'practice', icon: '💼', en: 'Practice', zh: '实战篇',
    pathPrefixes: ['/14-practice'],
    chapters: [
      { en: 'Ch14: IT Practice', zh: '第14章 IT实战', link: '/14-practice/' },
    ],
  },
]

const activePartIndex = computed(() => {
  const path = route.path
  for (let i = 0; i < parts.length; i++) {
    for (const pfx of parts[i].pathPrefixes) {
      if (path.includes(pfx)) return i
    }
  }
  return -1
})

function getChapterLink(link: string) {
  return prefix.value + link
}

function nodeClass(index: number) {
  const active = activePartIndex.value
  if (active < 0) return 'pn-node'
  if (index < active) return 'pn-node pn-done'
  if (index === active) return 'pn-node pn-active'
  return 'pn-node'
}

function lineClass(index: number) {
  const active = activePartIndex.value
  if (active < 0) return 'pn-line'
  if (index < active) return 'pn-line pn-line-done'
  return 'pn-line'
}

function onScroll() {
  const el = document.documentElement
  const scrollTop = el.scrollTop
  const scrollHeight = el.scrollHeight - el.clientHeight
  scrollProgress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null

function onNodeEnter(index: number) {
  if (hoverTimer) clearTimeout(hoverTimer)
  hoveredPart.value = index
}

function onNodeLeave() {
  hoverTimer = setTimeout(() => {
    hoveredPart.value = null
  }, 200)
}

function onDropdownEnter() {
  if (hoverTimer) clearTimeout(hoverTimer)
}

function onDropdownLeave() {
  hoverTimer = setTimeout(() => {
    hoveredPart.value = null
  }, 200)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', checkMobile)
  checkMobile()
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="pn-scroll-bar" :style="{ width: scrollProgress + '%' }" />
  <nav class="pn-rail" :class="{ 'pn-mobile': isMobile }">
    <template v-for="(part, i) in parts" :key="part.id">
      <div v-if="i > 0" :class="lineClass(i)" />
      <div
        :class="nodeClass(i)"
        @mouseenter="onNodeEnter(i)"
        @mouseleave="onNodeLeave"
      >
        <span class="pn-dot" />
        <span class="pn-label">
          <span class="pn-icon">{{ part.icon }}</span>
          <span v-if="!isMobile" class="pn-text">{{ isZh ? part.zh : part.en }}</span>
        </span>
        <Transition name="pn-dropdown">
          <div
            v-if="hoveredPart === i"
            class="pn-dropdown"
            @mouseenter="onDropdownEnter"
            @mouseleave="onDropdownLeave"
          >
            <div class="pn-dropdown-title">{{ isZh ? part.zh : part.en }}</div>
            <a
              v-for="ch in part.chapters"
              :key="ch.link"
              :href="getChapterLink(ch.link)"
              class="pn-dropdown-item"
            >
              {{ isZh ? ch.zh : ch.en }}
            </a>
          </div>
        </Transition>
      </div>
    </template>
  </nav>
</template>
