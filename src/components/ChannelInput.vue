<script setup>
import { ref } from 'vue'
import { parseUserId } from '../api/sevenTv.js'
import { t } from '../i18n.js'

const props = defineProps({
  loading: Boolean,
  error: String
})
const emit = defineEmits(['load'])

const value = ref('https://7tv.app/users/01FDZWAY2800000H48K2GFQEPK')
const localError = ref('')
const popping = ref(false)

function submit() {
  localError.value = ''
  const id = parseUserId(value.value)
  if (!id) {
    localError.value = t('input.invalid')
    return
  }
  popping.value = false
  // restart animation by toggling on next frame
  requestAnimationFrame(() => { popping.value = true })
  emit('load', id)
}
</script>

<template>
  <div class="panel elevated">
    <label class="stack-label">{{ t('input.label') }}</label>
    <div class="row">
      <input
        type="text"
        v-model="value"
        placeholder="https://7tv.app/users/01FDZWAY2800000H48K2GFQEPK"
        style="flex:1;min-width:260px"
        @keyup.enter="submit"
        :disabled="loading"
      />
      <div style="position:relative">
        <button class="primary" :disabled="loading" @click="submit">
          {{ loading ? t('input.loading') : t('input.submit') }}
        </button>
        <span class="pop-mark" :class="{ firing: popping }" @animationend="popping = false">
          {{ t('input.clicked') }}
        </span>
      </div>
    </div>
    <div v-if="localError || error" class="error" style="margin-top:10px;font-size:13px">
      {{ localError || error }}
    </div>
  </div>
</template>
