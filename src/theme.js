import { reactive, watch } from 'vue'

const STORAGE_KEY = 'ohhert.theme'

function detectTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* ignore */ }
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  }
  return 'light'
}

export const themeState = reactive({
  theme: detectTheme()
})

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return
  themeState.theme = theme
  try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignore */ }
}

export function toggleTheme() {
  setTheme(themeState.theme === 'dark' ? 'light' : 'dark')
}

watch(() => themeState.theme, applyTheme, { immediate: true })

// Follow system changes only when user hasn't made an explicit choice
if (typeof window !== 'undefined' && window.matchMedia) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener?.('change', (e) => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch { /* ignore */ }
    themeState.theme = e.matches ? 'dark' : 'light'
  })
}
