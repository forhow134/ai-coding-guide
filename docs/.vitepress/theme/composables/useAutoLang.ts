import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vitepress'

const STORAGE_KEY = 'lang_override'
const EXPIRE_DAYS = 30
const CHINESE_REGIONS = ['CN', 'TW', 'HK', 'MO']

interface LangOverride {
  lang: 'zh' | 'en'
  ts: number
}

function getOverride(): LangOverride | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data: LangOverride = JSON.parse(raw)
    const expired = Date.now() - data.ts > EXPIRE_DAYS * 24 * 60 * 60 * 1000
    if (expired) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

function setOverride(lang: 'zh' | 'en') {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, ts: Date.now() }))
}

function isBrowserChinese(): boolean {
  const lang = navigator.language || (navigator as any).userLanguage || ''
  return /^zh/i.test(lang)
}

async function isChineseIP(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    const res = await fetch('https://ip-api.com/json/?fields=countryCode', {
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const data = await res.json()
    return CHINESE_REGIONS.includes(data.countryCode)
  } catch {
    return false
  }
}

function isZhPath(path: string): boolean {
  return path.startsWith('/zh/') || path === '/zh'
}

function toZhPath(path: string): string {
  if (isZhPath(path)) return path
  return '/zh' + (path.startsWith('/') ? path : '/' + path)
}

function toEnPath(path: string): string {
  if (!isZhPath(path)) return path
  return path.replace(/^\/zh\/?/, '/') || '/'
}

export function useAutoLang() {
  const route = useRoute()
  const router = useRouter()

  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (!oldPath) return
      const wasZh = isZhPath(oldPath)
      const nowZh = isZhPath(newPath)
      if (wasZh !== nowZh) {
        setOverride(nowZh ? 'zh' : 'en')
      }
    },
  )

  onMounted(async () => {
    const override = getOverride()

    if (override) {
      const wantZh = override.lang === 'zh'
      const onZh = isZhPath(route.path)
      if (wantZh && !onZh) {
        router.go(toZhPath(route.path))
      } else if (!wantZh && onZh) {
        router.go(toEnPath(route.path))
      }
      return
    }

    if (isBrowserChinese()) {
      if (!isZhPath(route.path)) {
        router.go(toZhPath(route.path))
      }
      return
    }

    const chinese = await isChineseIP()
    if (chinese && !isZhPath(route.path)) {
      router.go(toZhPath(route.path))
    }
  })
}
