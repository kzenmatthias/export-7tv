<script setup>
import { t } from '../i18n.js'

const props = defineProps({
  connections: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

function platformLabel(p) {
  if (!p) return ''
  return p.charAt(0) + p.slice(1).toLowerCase()
}
</script>

<template>
  <div v-if="connections.length > 1" class="row" style="margin-top:12px">
    <label class="muted" style="font-size:13px;font-weight:600">{{ t('connection.label') }}</label>
    <select
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option v-for="c in connections" :key="c.id" :value="c.id">
        {{ platformLabel(c.platform) }} · {{ c.displayName }} ({{ c.emoteSet?.emotes?.length ?? 0 }})
      </option>
    </select>
  </div>
</template>
