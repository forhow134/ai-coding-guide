import DefaultTheme from 'vitepress/theme'
import ColabBadge from './components/ColabBadge.vue'
import DifficultyBadge from './components/DifficultyBadge.vue'
import CostBadge from './components/CostBadge.vue'
import RolePaths from './components/RolePaths.vue'
import CustomLayout from './CustomLayout.vue'
import CosmicBackground from './CosmicBackground.vue'
import type { Theme } from 'vitepress'
import './cosmic.css'

export default {
  extends: DefaultTheme,
  Layout: CustomLayout,
  enhanceApp({ app }) {
    app.component('ColabBadge', ColabBadge)
    app.component('DifficultyBadge', DifficultyBadge)
    app.component('CostBadge', CostBadge)
    app.component('CosmicBackground', CosmicBackground)
    app.component('RolePaths', RolePaths)
  },
} satisfies Theme
