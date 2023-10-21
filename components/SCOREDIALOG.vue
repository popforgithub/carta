<script setup lang="ts">
type Score = {
  id: string
  cardId: string
  question: string
  answer: string
  cardSetId: string
  cardSetName: string
  copiedAnswer: string
  roomId: string
  userId: string
  userName: string
  matchId: string
}
const props = defineProps<{
  score: Ref<Score>,
  scoreDialog: Ref<boolean>
  finishFlag: Ref<boolean>
}>()
const emits = defineEmits<{
  (e: 'closeScoreDialog'): void
  (e: 'finishGame', v: string, v2: string): void
}>()

const overlaySettings = {
  overlay: true, // スクリムを表示
  zIndex: 10, // スクリムのZインデックス
  clickToClose: false, // スクリムのクリックを無効化
}
const countdown = ref(0)
let countdownTimer = null

watch(() => props.scoreDialog.value, () => {
  if (props.scoreDialog.value) {
    countdown.value = 1 // タイムアウト時間を設定(s)
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        emits("closeScoreDialog")
        clearInterval(countdownTimer) // タイムアウト後にダイアログを閉じる（適切な処理を追加）
        if (props.finishFlag.value) { 
          emits("finishGame", props.score.value.matchId, props.score.value.roomId)
         }
        return
      }
    }, 1000)
  }
})
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="props.scoreDialog.value" persistent width="auto" :overlay="overlaySettings">
      <v-card>
        <v-card-text>
          {{ props.score.value.userName }} さんがカードを取りました。
          <p>Next Question in {{ countdown }} seconds</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
