<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'

defineProps<{
  path: string
}>()

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
</script>

<template>
  <div class="colab-badge-wrapper">
    <a
      :href="`https://colab.research.google.com/github/forhow134/ai-coding-guide/blob/main/${path}`"
      target="_blank"
      rel="noopener noreferrer"
      class="colab-badge"
      :title="isZh ? '在 Google Colab 中打开' : 'Open in Google Colab'"
    >
      <img
        src="https://colab.research.google.com/assets/colab-badge.svg"
        alt="Open In Colab"
      />
    </a>
    <span class="colab-local-hint">
      {{ isZh ? '本地运行：' : 'Run locally: ' }}<code>jupyter notebook {{ path }}</code>
    </span>
  </div>
</template>

<style scoped>
.colab-badge-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
}
.colab-badge {
  display: inline-block;
  flex-shrink: 0;
}
.colab-badge img {
  height: 20px;
}
.colab-local-hint {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.colab-local-hint code {
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-mute);
}
</style>
