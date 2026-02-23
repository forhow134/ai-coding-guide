<script setup lang="ts">
import { onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
let observer: MutationObserver | null = null

function fixSvgSizing(svg: SVGSVGElement) {
  svg.style.maxWidth = 'none'
  svg.style.height = 'auto'
  svg.style.minWidth = 'max-content'
  svg.removeAttribute('width')
}

function wrapMermaids() {
  const mermaids = document.querySelectorAll('.mermaid:not(.mz-wrapped)')
  mermaids.forEach((el) => {
    el.classList.add('mz-wrapped')

    const svg = el.querySelector('svg')
    if (svg) fixSvgSizing(svg)

    const container = document.createElement('div')
    container.className = 'mz-container'

    const toolbar = document.createElement('div')
    toolbar.className = 'mz-toolbar'

    let scale = 1

    const btnMinus = createBtn('\u2212', () => { scale = Math.max(0.3, scale - 0.15); applyScale() })
    const btnPlus = createBtn('+', () => { scale = Math.min(3, scale + 0.15); applyScale() })
    const btnReset = createBtn('Reset', () => { scale = 1; applyScale() })
    const btnFull = createBtn('\u26F6', () => openFullscreen(el as HTMLElement, scale))

    toolbar.append(btnMinus, btnPlus, btnReset, btnFull)

    const scrollBox = document.createElement('div')
    scrollBox.className = 'mz-scroll'

    el.parentNode!.insertBefore(container, el)
    scrollBox.appendChild(el)
    container.appendChild(toolbar)
    container.appendChild(scrollBox)

    function applyScale() {
      ;(el as HTMLElement).style.transform = `scale(${scale})`
      ;(el as HTMLElement).style.transformOrigin = 'top left'
      const h = (el as HTMLElement).scrollHeight * scale
      scrollBox.style.height = h > 0 ? `${h}px` : 'auto'
    }

    scrollBox.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        scale = Math.min(3, Math.max(0.3, scale + (e.deltaY > 0 ? -0.1 : 0.1)))
        applyScale()
      }
    }, { passive: false })
  })
}

function createBtn(text: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button')
  btn.className = 'mz-btn'
  btn.textContent = text
  btn.addEventListener('click', onClick)
  return btn
}

function openFullscreen(mermaidEl: HTMLElement, initialScale: number) {
  const overlay = document.createElement('div')
  overlay.className = 'mz-overlay'

  const panel = document.createElement('div')
  panel.className = 'mz-fullpanel'

  const topBar = document.createElement('div')
  topBar.className = 'mz-fulltoolbar'

  let fs = initialScale

  const fsMinus = createBtn('\u2212', () => { fs = Math.max(0.2, fs - 0.15); applyFs() })
  const fsPlus = createBtn('+', () => { fs = Math.min(5, fs + 0.15); applyFs() })
  const fsReset = createBtn('Reset', () => { fs = 1; applyFs() })
  const fsClose = createBtn('\u2715 Close', close)

  topBar.append(fsMinus, fsPlus, fsReset, fsClose)

  const scrollArea = document.createElement('div')
  scrollArea.className = 'mz-fullscroll'

  const clone = mermaidEl.cloneNode(true) as HTMLElement
  clone.classList.remove('mz-wrapped')
  clone.style.transform = `scale(${fs})`
  clone.style.transformOrigin = 'top left'

  const svg = clone.querySelector('svg')
  if (svg) fixSvgSizing(svg as SVGSVGElement)

  scrollArea.appendChild(clone)
  panel.appendChild(topBar)
  panel.appendChild(scrollArea)
  overlay.appendChild(panel)
  document.body.appendChild(overlay)
  document.body.style.overflow = 'hidden'

  function applyFs() {
    clone.style.transform = `scale(${fs})`
    const h = clone.scrollHeight * fs + 40
    scrollArea.style.height = h > 0 ? `${h}px` : 'auto'
  }

  function close() {
    overlay.remove()
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKey)
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }

  document.addEventListener('keydown', onKey)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close()
  })

  scrollArea.addEventListener('wheel', (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      fs = Math.min(5, Math.max(0.2, fs + (e.deltaY > 0 ? -0.1 : 0.1)))
      applyFs()
    }
  }, { passive: false })

  let dragging = false, startX = 0, startY = 0, scrollL = 0, scrollT = 0
  scrollArea.addEventListener('mousedown', (e) => {
    dragging = true; startX = e.clientX; startY = e.clientY
    scrollL = scrollArea.scrollLeft; scrollT = scrollArea.scrollTop
    scrollArea.style.cursor = 'grabbing'
  })
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return
    scrollArea.scrollLeft = scrollL - (e.clientX - startX)
    scrollArea.scrollTop = scrollT - (e.clientY - startY)
  })
  window.addEventListener('mouseup', () => {
    dragging = false; scrollArea.style.cursor = 'grab'
  })

  applyFs()
}

function initObserver() {
  if (observer) observer.disconnect()

  observer = new MutationObserver(() => {
    nextTick(() => setTimeout(wrapMermaids, 300))
  })

  const targets = [
    document.querySelector('.VPContent'),
    document.querySelector('.VPHome'),
    document.querySelector('.VPDoc'),
  ].filter(Boolean) as Element[]

  if (targets.length === 0) {
    observer.observe(document.body, { childList: true, subtree: true })
  } else {
    targets.forEach((t) => observer!.observe(t, { childList: true, subtree: true }))
  }
}

onMounted(() => {
  nextTick(() => setTimeout(() => { wrapMermaids(); initObserver() }, 600))
})

onUnmounted(() => {
  observer?.disconnect()
})

watch(() => route.path, () => {
  nextTick(() => setTimeout(() => { wrapMermaids(); initObserver() }, 600))
})
</script>

<template>
  <div style="display:none" />
</template>
