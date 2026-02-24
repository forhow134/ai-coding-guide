<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const SIDEBAR_ID = 'sc-sidebar-btn'
const ASIDE_ID = 'sc-aside-btn'

const isSidebarCollapsed = ref(false)
const isAsideCollapsed = ref(false)

function createButton(id: string): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.id = id
  btn.className = 'sc-toggle-btn'
  btn.setAttribute('aria-pressed', 'false')
  return btn
}

function updateSidebarBtn(btn: HTMLButtonElement) {
  if (isSidebarCollapsed.value) {
    btn.innerHTML = '›'
    btn.title = 'Expand sidebar'
    btn.setAttribute('aria-pressed', 'true')
  } else {
    btn.innerHTML = '‹'
    btn.title = 'Collapse sidebar'
    btn.setAttribute('aria-pressed', 'false')
  }
}

function updateAsideBtn(btn: HTMLButtonElement) {
  if (isAsideCollapsed.value) {
    btn.innerHTML = '‹'
    btn.title = 'Expand outline'
    btn.setAttribute('aria-pressed', 'true')
  } else {
    btn.innerHTML = '›'
    btn.title = 'Collapse outline'
    btn.setAttribute('aria-pressed', 'false')
  }
}

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('vp-sc-sidebar', String(isSidebarCollapsed.value))
  
  if (isSidebarCollapsed.value) {
    document.documentElement.classList.add('sc-sidebar-collapsed')
  } else {
    document.documentElement.classList.remove('sc-sidebar-collapsed')
  }
  
  const btn = document.getElementById(SIDEBAR_ID) as HTMLButtonElement | null
  if (btn) updateSidebarBtn(btn)
}

function toggleAside() {
  isAsideCollapsed.value = !isAsideCollapsed.value
  localStorage.setItem('vp-sc-aside', String(isAsideCollapsed.value))
  
  if (isAsideCollapsed.value) {
    document.documentElement.classList.add('sc-aside-collapsed')
  } else {
    document.documentElement.classList.remove('sc-aside-collapsed')
  }
  
  const btn = document.getElementById(ASIDE_ID) as HTMLButtonElement | null
  if (btn) updateAsideBtn(btn)
}

function initSidebarBtn() {
  if (document.getElementById(SIDEBAR_ID)) return

  const btn = createButton(SIDEBAR_ID)
  btn.addEventListener('click', toggleSidebar)
  updateSidebarBtn(btn)
  document.body.appendChild(btn)
}

function initAsideBtn() {
  const existing = document.getElementById(ASIDE_ID)
  if (existing) existing.remove()

  const asideEl = document.querySelector('.VPDoc .aside')
  if (!asideEl) return

  // Measure and set aside width for accurate positioning
  const asideWidth = asideEl.getBoundingClientRect().width
  if (asideWidth > 0) {
    document.documentElement.style.setProperty('--sc-aside-width', `${asideWidth}px`)
  }

  const btn = createButton(ASIDE_ID)
  btn.addEventListener('click', toggleAside)
  updateAsideBtn(btn)
  document.body.appendChild(btn)
}

function init() {
  initSidebarBtn()
  initAsideBtn()
}

function onResize() {
  if (window.innerWidth >= 960) {
    initAsideBtn()
  }
}

onMounted(() => {
  isSidebarCollapsed.value = localStorage.getItem('vp-sc-sidebar') === 'true'
  isAsideCollapsed.value = localStorage.getItem('vp-sc-aside') === 'true'
  
  if (isSidebarCollapsed.value) document.documentElement.classList.add('sc-sidebar-collapsed')
  if (isAsideCollapsed.value) document.documentElement.classList.add('sc-aside-collapsed')

  nextTick(() => {
    setTimeout(() => {
      init()
      window.addEventListener('resize', onResize)
    }, 400)
  })
})

onUnmounted(() => {
  document.getElementById(SIDEBAR_ID)?.remove()
  document.getElementById(ASIDE_ID)?.remove()
  window.removeEventListener('resize', onResize)
  document.documentElement.classList.remove('sc-sidebar-collapsed', 'sc-aside-collapsed')
})

watch(() => route.path, () => {
  nextTick(() => {
    setTimeout(() => {
      initAsideBtn()
    }, 400)
  })
})
</script>

<template>
  <div style="display:none" />
</template>
