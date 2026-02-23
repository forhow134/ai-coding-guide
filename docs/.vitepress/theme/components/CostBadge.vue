<script setup lang="ts">
defineProps<{
  cost: string
}>()
</script>

<template>
  <span class="cost-badge" :title="`预计 API 费用：${cost}`">
    {{ cost === '$0' ? '免费' : `~${cost}` }}
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
