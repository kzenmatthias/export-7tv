<script setup>
import { computed, ref } from 'vue'
import { FORMATS } from '../exporters/formats.js'
import { t } from '../i18n.js'

const props = defineProps({
  emotes: { type: Array, required: true },
  filenameBase: { type: String, default: 'emotes' }
})

const activeId = ref('txt')
const copied = ref(false)

const active = computed(() => FORMATS.find(f => f.id === activeId.value) || FORMATS[0])
const output = computed(() => active.value.build(props.emotes))

async function copyOutput() {
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1200)
  } catch {
    // ignore
  }
}

function downloadOutput() {
  const blob = new Blob([output.value], { type: active.value.mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.filenameBase}-${active.value.id}.${active.value.ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<template>
  <div class="panel">
    <div class="row" style="margin-bottom:12px;gap:6px">
      <button
        v-for="f in FORMATS"
        :key="f.id"
        class="pill"
        :class="{ 'is-active': activeId === f.id }"
        @click="activeId = f.id"
      >{{ t(f.labelKey) }}</button>
    </div>
    <textarea
      readonly
      :value="output"
      rows="14"
      style="width:100%;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;resize:vertical;background:var(--surface)"
    ></textarea>
    <div class="row" style="margin-top:12px">
      <button class="primary" @click="copyOutput">
        {{ copied ? t('export.copied') : t('export.copy') }}
      </button>
      <button @click="downloadOutput">{{ t('export.download') }} .{{ active.ext }}</button>
      <span class="spacer"></span>
      <span class="muted" style="font-size:12px">
        {{ t('export.chars', output.length) }}
      </span>
    </div>
  </div>
</template>
