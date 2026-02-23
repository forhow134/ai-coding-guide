<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{
  level: 'beginner' | 'intermediate' | 'advanced'
}>()

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))

const labels = {
  beginner:     { zh: '入门', en: 'Beginner' },
  intermediate: { zh: '进阶', en: 'Intermediate' },
  advanced:     { zh: '高级', en: 'Advanced' },
}

const colors = {
  beginner:     { color: '#52c41a', bg: '#f6ffed' },
  intermediate: { color: '#1890ff', bg: '#e6f7ff' },
  advanced:     { color: '#722ed1', bg: '#f9f0ff' },
}

const label = computed(() => isZh.value ? labels[props.level].zh : labels[props.level].en)
const style = computed(() => colors[props.level])
</script>

<template>
  <span
    class="difficulty-badge"
    :style="{ color: style.color, backgroundColor: style.bg, borderColor: style.color }"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.difficulty-badge {
  display: inline-block;
  font-size: 12px;
  line-height: 1;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid;
  font-weight: 500;
  vertical-align: middle;
  margin-left: 8px;
}
</style>
