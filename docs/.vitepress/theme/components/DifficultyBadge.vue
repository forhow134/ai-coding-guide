<script setup lang="ts">
const props = defineProps<{
  level: 'beginner' | 'intermediate' | 'advanced'
}>()

const config = {
  beginner: { label: '入门', color: '#52c41a', bg: '#f6ffed' },
  intermediate: { label: '进阶', color: '#1890ff', bg: '#e6f7ff' },
  advanced: { label: '高级', color: '#722ed1', bg: '#f9f0ff' },
}

const current = config[props.level]
</script>

<template>
  <span
    class="difficulty-badge"
    :style="{ color: current.color, backgroundColor: current.bg, borderColor: current.color }"
  >
    {{ current.label }}
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
