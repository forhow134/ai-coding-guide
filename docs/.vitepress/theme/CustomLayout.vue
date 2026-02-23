<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useAutoLang } from './composables/useAutoLang'
import MermaidZoom from './MermaidZoom.vue'
import ProgressNav from './components/ProgressNav.vue'
import PathNavigator from './components/PathNavigator.vue'

const { Layout } = DefaultTheme

useAutoLang()
</script>

<template>
  <Layout>
    <template #layout-top>
      <ClientOnly>
        <CosmicBackground />
        <MermaidZoom />
      </ClientOnly>
    </template>
    <template #nav-bar-content-before>
      <ClientOnly>
        <ProgressNav />
      </ClientOnly>
    </template>
    <template #doc-footer-before>
      <ClientOnly>
        <PathNavigator />
      </ClientOnly>
    </template>
  </Layout>
</template>
