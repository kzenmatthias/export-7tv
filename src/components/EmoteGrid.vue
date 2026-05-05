<script setup>
import { ref } from 'vue'
import { t } from '../i18n.js'

const props = defineProps({
  emotes: { type: Array, required: true }
})

const copiedId = ref(null)

async function copyUrl(emote) {
  try {
    await navigator.clipboard.writeText(emote.url)
    copiedId.value = emote.id
    setTimeout(() => {
      if (copiedId.value === emote.id) copiedId.value = null
    }, 1200)
  } catch {
    // ignore
  }
}
</script>

<template>
  <div class="panel">
    <div class="row" style="margin-bottom:14px">
      <strong style="font-size:18px">{{ emotes.length }}</strong>
      <span class="muted">{{ t('grid.emotes', emotes.length) }}</span>
    </div>
    <div v-if="emotes.length === 0" class="muted">{{ t('grid.empty') }}</div>
    <div v-else class="grid">
      <div v-for="e in emotes" :key="e.id" class="tile">
        <div class="thumb">
          <img :src="e.url" :alt="e.name" loading="lazy" />
        </div>
        <div class="meta">
          <div class="name" :title="e.name">{{ e.name }}</div>
          <button
            class="copy"
            :title="`Copy ${e.url}`"
            @click="copyUrl(e)"
          >{{ copiedId === e.id ? t('grid.copied') : t('grid.copy') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}
.tile {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 120ms, transform 120ms;
}
.tile:hover {
  border-color: var(--brand);
  transform: translateY(-1px);
}
.thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  background: var(--thumb-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}
.thumb img {
  max-width: 100%;
  max-height: 100%;
  image-rendering: -webkit-optimize-contrast;
}
.meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.copy {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 999px;
}
</style>
