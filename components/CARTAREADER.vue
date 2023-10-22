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
  initialNextScoreId: Ref<string>
  nextScoreId: Ref<string>
  readNextCartaFlag: Ref<boolean>
}>()
const emits = defineEmits<{
  (e: 'resetAudioFlag'): void
}>()

const getScoreById = async (scoreId: string) => {
  const { data: scoreResponse } = await useFetch('/api/scores/:id',
    { 
      method: 'get',
      params: { id: scoreId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return scoreResponse.value
}
const questionSrc = ref()
const updateQuestionSrc = async (scoreId: string) => {
  const score = await getScoreById(scoreId)
  questionSrc.value = await import(`~/assets/cartaQuestion/${score.cardSetName}/${score.answer}.mp3`)
}
const audioPlayer = ref<HTMLAudioElement | null>(null)

const playAudio = async () => {
  audioPlayer.value.play()
}

watch(() => props.initialNextScoreId.value, async () => {
  await updateQuestionSrc(props.initialNextScoreId.value)
  { playAudio() } if (props.initialNextScoreId.value)
  emits('resetAudioFlag')
})
watch(() => props.readNextCartaFlag.value, async () => {
  await updateQuestionSrc(props.nextScoreId.value)
  { playAudio() } if (props.readNextCartaFlag.value)
  emits('resetAudioFlag')
})
</script>

<template>
  <div>
    <audio ref="audioPlayer">
      <source :src="questionSrc">
    </audio>
    {{ questionSrc }}
  </div>
</template>
