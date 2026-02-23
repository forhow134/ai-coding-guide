<script setup lang="ts">
import { useData } from 'vitepress'

defineProps<{
  path: string
}>()

const repoBase = 'https://github.com'
</script>

<template>
  <div class="colab-badge-wrapper">
    <a
      :href="`https://colab.research.google.com/github/forhow134/ai-coding-guide/blob/main/${path}`"
      target="_blank"
      rel="noopener noreferrer"
      class="colab-badge"
      title="在 Google Colab 中打开（需要先将项目推送到 GitHub）"
    >
      <img
        src="https://colab.research.google.com/assets/colab-badge.svg"
        alt="Open In Colab"
      />
    </a>
    <span class="colab-local-hint">
      本地运行：<code>jupyter notebook {{ path }}</code>
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
