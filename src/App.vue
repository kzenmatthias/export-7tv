<script setup>
import { computed, ref, watch } from 'vue'
import { fetchUser, getConnections, normalizeEmotes } from './api/sevenTv.js'
import { i18n, t, setLocale, SUPPORTED_LOCALES } from './i18n.js'
import { themeState, toggleTheme } from './theme.js'
import ChannelInput from './components/ChannelInput.vue'
import ConnectionPicker from './components/ConnectionPicker.vue'
import ExportControls from './components/ExportControls.vue'
import EmoteGrid from './components/EmoteGrid.vue'
import ExportPanel from './components/ExportPanel.vue'

const loading = ref(false)
const error = ref('')
const user = ref(null)
const selectedConnectionId = ref('')
const size = ref('4x')
const ext = ref('webp')

const connections = computed(() => getConnections(user.value))
const activeConnection = computed(() => {
  if (!connections.value.length) return null
  return connections.value.find(c => c.id === selectedConnectionId.value) ?? connections.value[0]
})
const emotes = computed(() => normalizeEmotes(activeConnection.value, size.value, ext.value))
const hasAnimated = computed(() => emotes.value.some(e => e.animated))
const filenameBase = computed(() => {
  if (!user.value) return 'emotes'
  const slug = (user.value.username || user.value.display_name || 'emotes')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'emotes'}-emotes`
})

watch(connections, (list) => {
  if (list.length && !list.find(c => c.id === selectedConnectionId.value)) {
    selectedConnectionId.value = list[0].id
  }
})

watch(hasAnimated, (anim) => {
  if (!anim && ext.value === 'gif') ext.value = 'webp'
})

async function load(id) {
  loading.value = true
  error.value = ''
  try {
    user.value = await fetchUser(id)
  } catch (err) {
    error.value = err.message || 'Failed to load user.'
    user.value = null
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="hero">
    <div class="hero-inner">
      <div class="brand-bar-row">
        <a class="brand-link" href="https://ohhert.be" target="_blank" rel="noopener" aria-label="ohhert.be">
          <svg class="brand-mark" viewBox="0 0 432 624" aria-hidden="true">
            <path d="M72 253c7.042 1.41 13.65 3.47 20.414 5.867l3.34 1.171a4749 4749 0 0 1 10.871 3.837l3.811 1.343c24.105 8.493 48.13 17.203 72.134 25.977a7210 7210 0 0 0 28.392 10.301l7.27 2.626a8925 8925 0 0 1 65.272 23.885 3280 3280 0 0 0 51.183 18.43c29.9 10.506 29.9 10.506 43.252 15.366q2.379.864 4.764 1.718c13.464 4.825 26.905 10.3 37.297 20.479 4.11 4.911 8.004 9.851 10 16 1.357 8.25 1.182 15.937-1 24l-.676 2.52c-2.293 6.9-6.342 12.227-11.673 17.13-2.763 2.259-5.779 3.829-8.975 5.39l-2.114 1.039c-7.467 3.54-15.135 5.668-23.125 7.671q-2.378.62-4.757 1.242c-5.22 1.362-10.45 2.686-15.68 4.008l-5.731 1.455-2.934.745-5.942 1.51-2.994.76-3.007.764q-3.024.768-6.05 1.533c-13.548 3.43-27.018 7.043-40.43 10.97-10.891 3.186-21.837 6.056-32.846 8.808-24.802 6.213-48.606 12.95-67.605 31.014-10.66 10.516-17.588 22.66-21.625 37.082-3.816 15.333-4.874 30.615-5.836 46.359l-2.373.44c-19.472 3.647-38.282 8.257-57.158 14.337l-2.642.848q-2.432.786-4.855 1.598C96.212 622.454 92.97 623.32 89 623c-8.116-21.865-7.637-45.263-3.906-68.086 5.514-30.887 21.433-61.26 41.485-85.235L128 468l1.413-1.675c21.507-25.161 51.035-40.381 81.772-51.34q2.96-1.034 5.935-2.02l3.028-1.031 2.748-.909L225 410c1.05-3.15 1.101-5.388 1.063-8.687l-.028-3.012L226 396l-2.125-.645c-20.339-6.272-40.098-13.859-59.812-21.855l-3.618-1.466a3243 3243 0 0 1-20.965-8.596 2276 2276 0 0 0-7.089-2.915 2561 2561 0 0 1-10.582-4.367l-3.202-1.303C110.082 351.29 102.134 347.074 96 340c-15.71-23.348-21.527-59.544-24-87M10 0c16.172 2.605 30.98 8.75 46.064 14.878 2.697 1.092 5.398 2.172 8.1 3.25 5.566 2.224 11.13 4.457 16.684 6.71l2.951 1.195C86 27 86 27 87 28c.111 2.975.162 5.93.176 8.906q.034 2.82.072 5.637c.035 2.953.064 5.905.078 8.858.087 15.803 1.103 31.068 8.424 45.412l1.04 2.113c6.552 13.01 14.695 24.495 26.876 32.695C141.718 143.377 161.334 153.598 183 156l-.443-1.633c-.67-2.475-1.332-4.952-1.994-7.43l-.698-2.568c-4.34-16.289-5.01-35.302-.732-51.701C180.224 89.31 181.42 86.159 183 83c7.92.506 14.833 2.678 22.313 5.25l3.474 1.16C216.332 91.964 223.69 94.84 231 98l-.032 2.668c-.79 33.467-.79 33.467 8.446 65.309 4.156 7.356 9.016 12.613 16.258 17 10.605 6.15 21.85 10.761 33.327 15.003 11.703 4.338 22.643 8.611 31.317 17.989 4.218 5.089 7.224 9.908 8.403 16.484.86 7.793 1.055 15.597-1.559 23.074-3.28 6.99-7.812 12.813-13.973 17.473-5.75 3.678-11.626 5.499-18.39 6.242-2.3.077-4.504-.042-6.797-.242l-2.969-.246c-6.761-.766-13.136-2.208-19.636-4.168l-2.582-.778c-11.708-3.61-23.196-7.87-34.705-12.063a7347 7347 0 0 0-21.213-7.679l-2.16-.78c-14.306-5.16-28.666-10.154-43.048-15.099C94.44 215.012 94.44 215.012 76 201l-2.582-1.953c-6.06-4.73-11.802-9.8-17.418-15.047l-2.617-2.418C41.65 170.342 31.995 157.116 24 143l-1.01-1.771C8.497 115.629.71 87.596.887 58.16Q.93 55.08 1 52l.038-2.01C1.443 32.97 4.451 16.092 10 0"/>
          </svg>
          <span class="brand-text">
            <span class="wordmark">ohhert<span class="dot">.</span>be</span>
            <span class="tagline">tools &amp; experiments</span>
          </span>
        </a>

        <div class="toolbar" role="group" :aria-label="t('a11y.langSwitcher')">
          <div class="lang-seg" role="group">
            <button
              v-for="loc in SUPPORTED_LOCALES"
              :key="loc"
              :class="{ 'is-active': i18n.locale === loc }"
              :aria-pressed="i18n.locale === loc"
              @click="setLocale(loc)"
            >{{ loc }}</button>
          </div>
          <button
            class="toolbar-btn"
            type="button"
            :aria-label="t('a11y.themeToggle')"
            :title="t('a11y.themeToggle')"
            @click="toggleTheme"
          >
            <svg v-if="themeState.theme === 'dark'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span>{{ themeState.theme === 'dark' ? 'Light' : 'Dark' }}</span>
          </button>
        </div>
      </div>

      <span class="brand-pill" style="margin-bottom:18px"><span class="dot"></span> {{ t('badge.noKeys') }}</span>

      <h1 class="page-title">
        {{ t('hero.title.lead') }} <span class="accent">{{ t('hero.title.accent') }}</span>{{ t('hero.title.tail') ? ' ' + t('hero.title.tail') : '' }}
      </h1>
      <p class="page-title-sub">{{ t('hero.subtitle') }}</p>
    </div>
  </div>

  <div class="app-shell">
    <ChannelInput :loading="loading" :error="error" @load="load" />

    <div v-if="user" class="panel">
      <div class="row">
        <img
          v-if="user.avatar_url"
          :src="user.avatar_url"
          alt=""
          width="48"
          height="48"
          style="border-radius:50%;background:var(--surface);border:2px solid var(--primary-border)"
        />
        <div>
          <div style="font-weight:800;font-size:18px">{{ user.display_name || user.username }}</div>
          <div class="muted" style="font-size:13px">
            {{ t('user.connections', connections.length) }}
            <template v-if="activeConnection">
              · {{ t('user.activeSet', activeConnection.emoteSet?.emotes?.length ?? 0) }}
            </template>
          </div>
        </div>
      </div>
      <ConnectionPicker
        :connections="connections"
        v-model="selectedConnectionId"
      />
    </div>

    <template v-if="user && activeConnection">
      <ExportControls
        :size="size"
        :ext="ext"
        :hasAnimated="hasAnimated"
        @update:size="size = $event"
        @update:ext="ext = $event"
      />
      <ExportPanel :emotes="emotes" :filename-base="filenameBase" />
      <EmoteGrid :emotes="emotes" />
    </template>

    <footer class="app-footer">
      {{ t('footer.builtBy') }} <a href="https://ohhert.be" target="_blank" rel="noopener">ohhert.be</a>
      · {{ t('footer.api') }} · {{ t('footer.disclaimer') }}
      <span class="quirk">{{ t('footer.quirk') }}</span>
    </footer>
  </div>
</template>
