<script setup>
import { t } from '../i18n.js'

const props = defineProps({
  size: { type: String, required: true },
  ext: { type: String, required: true },
  hasAnimated: { type: Boolean, default: false }
})
const emit = defineEmits(['update:size', 'update:ext'])

const SIZES = ['1x', '2x', '3x', '4x']
const EXTS = [
  { id: 'webp', label: 'WEBP' },
  { id: 'avif', label: 'AVIF' },
  { id: 'png', label: 'PNG' },
  { id: 'gif', labelKey: 'controls.gif' }
]
</script>

<template>
  <div class="panel">
    <div class="row" style="gap:14px">
      <span class="stack-label" style="margin:0">{{ t('controls.size') }}</span>
      <div class="row" style="gap:6px">
        <button
          v-for="s in SIZES"
          :key="s"
          class="pill"
          :class="{ 'is-active': size === s }"
          @click="emit('update:size', s)"
        >{{ s }}</button>
      </div>

      <span class="stack-label" style="margin:0 0 0 12px">{{ t('controls.format') }}</span>
      <div class="row" style="gap:6px">
        <button
          v-for="e in EXTS"
          :key="e.id"
          class="pill"
          :class="{ 'is-active': ext === e.id }"
          :disabled="e.id === 'gif' && !hasAnimated"
          :title="e.id === 'gif' && !hasAnimated ? t('controls.gifDisabled') : ''"
          @click="emit('update:ext', e.id)"
        >{{ e.labelKey ? t(e.labelKey) : e.label }}</button>
      </div>
    </div>
  </div>
</template>
