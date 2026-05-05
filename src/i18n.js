import { reactive, watch } from 'vue'

const STORAGE_KEY = 'ohhert.locale'
const SUPPORTED = ['nl', 'en']
const DEFAULT_LOCALE = 'en'

function detectLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED.includes(stored)) return stored
  } catch {
    // ignore
  }
  const candidates = []
  if (typeof navigator !== 'undefined') {
    if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages)
    if (navigator.language) candidates.push(navigator.language)
  }
  for (const lang of candidates) {
    if (!lang) continue
    const base = lang.toLowerCase().split('-')[0]
    if (SUPPORTED.includes(base)) return base
  }
  return DEFAULT_LOCALE
}

const messages = {
  nl: {
    'a11y.langSwitcher': 'Taal wisselen',
    'a11y.themeToggle': 'Donker/licht thema wisselen',

    'badge.noKeys': 'Geen API-keys, geen accounts',
    'hero.title.lead': 'Pak die',
    'hero.title.accent': '7TV-emotes',
    'hero.title.tail': 'mee.',
    'hero.subtitle': 'Plak een 7TV-channel-link of user-ID. Je krijgt meteen alle namen + CDN-links, klaar om te exporteren als TSV, CSV, JSON, Markdown, HTML of BBCode.',

    'input.label': '7TV-channel-URL of user-ID',
    'input.submit': 'Emotes ophalen',
    'input.loading': 'Bezig…',
    'input.invalid': 'Geen 7TV user-ID gevonden in die invoer.',
    'input.clicked': 'Geklikt!',

    'connection.label': 'Verbinding',
    'user.connections': (n) => `${n} ${n === 1 ? 'verbinding' : 'verbindingen'}`,
    'user.activeSet': (n) => `${n} emotes in actieve set`,

    'controls.size': 'Grootte',
    'controls.format': 'Formaat',
    'controls.gif': 'GIF (animated)',
    'controls.gifDisabled': 'Geen animated emotes in deze set',

    'grid.emotes': (n) => (n === 1 ? 'emote' : 'emotes'),
    'grid.empty': 'Deze verbinding heeft geen emotes.',
    'grid.copy': 'Kopiëren',
    'grid.copied': 'Gekopieerd',

    'export.copy': 'Kopieer naar klembord',
    'export.copied': 'Gekopieerd',
    'export.download': 'Download',
    'export.chars': (n) => `${n.toLocaleString('nl-BE')} tekens`,

    'format.txt': 'Platte tekst (TSV)',
    'format.csv': 'CSV',
    'format.json': 'JSON',
    'format.mdTable': 'Markdown-tabel',
    'format.mdImages': 'Markdown-afbeeldingen',
    'format.html': 'HTML-galerij',
    'format.bbcode': 'BBCode',

    'footer.builtBy': 'Gebouwd door',
    'footer.api': 'gebruikt de publieke 7TV-API',
    'footer.disclaimer': 'niet geaffilieerd met 7TV',
    'footer.quirk': 'Er worden geen emotes mishandeld op deze website.'
  },
  en: {
    'a11y.langSwitcher': 'Switch language',
    'a11y.themeToggle': 'Toggle dark/light theme',

    'badge.noKeys': 'No API keys, no accounts',
    'hero.title.lead': 'Grab those',
    'hero.title.accent': '7TV emotes.',
    'hero.title.tail': '',
    'hero.subtitle': 'Paste a 7TV channel link or user ID. You get every name and CDN link instantly, ready to export as TSV, CSV, JSON, Markdown, HTML or BBCode.',

    'input.label': '7TV channel URL or user ID',
    'input.submit': 'Load emotes',
    'input.loading': 'Loading…',
    'input.invalid': 'Could not find a 7TV user ID in that input.',
    'input.clicked': 'Clicked!',

    'connection.label': 'Connection',
    'user.connections': (n) => `${n} ${n === 1 ? 'connection' : 'connections'}`,
    'user.activeSet': (n) => `${n} emotes in active set`,

    'controls.size': 'Size',
    'controls.format': 'Format',
    'controls.gif': 'GIF (animated)',
    'controls.gifDisabled': 'No animated emotes in this set',

    'grid.emotes': (n) => (n === 1 ? 'emote' : 'emotes'),
    'grid.empty': 'This connection has no emotes.',
    'grid.copy': 'Copy',
    'grid.copied': 'Copied',

    'export.copy': 'Copy to clipboard',
    'export.copied': 'Copied',
    'export.download': 'Download',
    'export.chars': (n) => `${n.toLocaleString('en-US')} chars`,

    'format.txt': 'Plain text (TSV)',
    'format.csv': 'CSV',
    'format.json': 'JSON',
    'format.mdTable': 'Markdown table',
    'format.mdImages': 'Markdown images',
    'format.html': 'HTML gallery',
    'format.bbcode': 'BBCode',

    'footer.builtBy': 'Built by',
    'footer.api': 'uses the public 7TV API',
    'footer.disclaimer': 'not affiliated with 7TV',
    'footer.quirk': 'No emotes are mistreated on this website.'
  }
}

export const i18n = reactive({
  locale: detectLocale()
})

export function t(key, ...args) {
  const dict = messages[i18n.locale] || messages[DEFAULT_LOCALE]
  const value = dict[key]
  if (typeof value === 'function') return value(...args)
  if (value !== undefined) return value
  // fallback to English then to the key itself
  const fb = messages[DEFAULT_LOCALE][key]
  if (typeof fb === 'function') return fb(...args)
  return fb ?? key
}

export function setLocale(loc) {
  if (!SUPPORTED.includes(loc)) return
  i18n.locale = loc
  try { localStorage.setItem(STORAGE_KEY, loc) } catch { /* ignore */ }
}

export const SUPPORTED_LOCALES = SUPPORTED

watch(() => i18n.locale, (loc) => {
  if (typeof document !== 'undefined') document.documentElement.lang = loc
}, { immediate: true })
