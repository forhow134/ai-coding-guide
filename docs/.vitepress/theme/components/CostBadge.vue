<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'

defineProps<{
  cost: string
}>()

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
</script>

<template>
  <span class="cost-badge" :title="isZh ? `预计 API 费用：${cost}` : `Estimated API cost: ${cost}`">
    {{ cost === '$0' ? (isZh ? '免费' : 'Free') : `~${cost}` }}
  </span>
</template>

<style scoped>
.cost-badge {
  display: inline-block;
  font-size: 11px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 8px;
  background-color: #fff7e6;
  color: #d48806;
  border: 1px solid #ffd591;
  font-weight: 500;
  vertical-align: middle;
  margin-left: 6px;
  cursor: help;
}
</style>
