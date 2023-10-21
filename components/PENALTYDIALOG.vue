<script setup lang="ts">
const props = defineProps<{
  penaltyDialog: Ref<boolean>
}>()
const emits = defineEmits<{
  (e: 'closePenaltyDialog'): void
}>()
const overlaySettings = {
  overlay: true, // スクリムを表示
  zIndex: 10, // スクリムのZインデックス
  clickToClose: false, // スクリムのクリックを無効化
}

const countdown = ref(0)
let countdownTimer = null

watch(() => props.penaltyDialog.value, () => {
  if (props.penaltyDialog.value) {
    countdown.value = 20 // タイムアウト時間を設定(s)
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        emits('closePenaltyDialog')
        clearInterval(countdownTimer)
      }
    }, 1000)
  } else {
    clearInterval(countdownTimer)
  }
})
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="props.penaltyDialog.value" persistent width="auto" :overlay="overlaySettings">
      <v-card>
        <v-card-text>
          <p>おてつきです。</p>
          <p>Wait for {{ countdown }} seconds</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
