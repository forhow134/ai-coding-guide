import type { UserConfig } from 'vitepress'

export const shared: UserConfig = {
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  markdown: {
    lineNumbers: true,
  },

  mermaid: {
    theme: 'base',
    securityLevel: 'loose',
    themeVariables: {
      primaryTextColor: '#1a2340',
      secondaryTextColor: '#2d1b4e',
      tertiaryTextColor: '#1a3a2e',
      nodeTextColor: '#1a2340',
      labelTextColor: '#1a2340',
      actorTextColor: '#1a2340',
      signalTextColor: '#1a2340',
      actorLineColor: '#6b8ec2',
      primaryColor: '#d0e8ff',
      primaryBorderColor: '#3b82f6',
      secondaryColor: '#e0d4ff',
      secondaryBorderColor: '#8b5cf6',
      tertiaryColor: '#d0ffe8',
      tertiaryBorderColor: '#10b981',
      mainBkg: '#d0e8ff',
      nodeBorder: '#3b82f6',
      lineColor: '#6b8ec2',
      clusterBkg: '#eef4ff',
      clusterBorder: '#93b5e0',
      titleColor: '#1a2340',
      edgeLabelBackground: '#f0f4fa',
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
    },
  },

  themeConfig: {
    logo: '/logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/forhow134/ai-coding-guide' },
    ],
  },
}
