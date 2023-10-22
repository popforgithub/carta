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
  nextScore: Ref<Score>
  readNextCartaFlag: Ref<boolean>
}>()
const emits = defineEmits<{
  (e: 'resetAudioFlag'): void
}>()

const questionSrc = ref(`/assets/cartaQuestion/${props.nextScore.value.cardSetName}/${props.nextScore.value.answer}.mp3`)
const updateQuestionSrc = async () => {
  questionSrc.value = questionSrc.value = `/assets/cartaQuestion/${props.nextScore.value.cardSetName}/${props.nextScore.value.answer}.mp3`
}

const audioPlayer = ref<HTMLAudioElement | null>(null)
const playAudio = async () => {
  audioPlayer.value.play()
}
const loadAudio = async () => {
  updateQuestionSrc()
  audioPlayer.value.load()
}

watch(() => props.nextScore.value, async () => {
  if (props.nextScore.value) {
    loadAudio()
    emits('resetAudioFlag')
  }
})
watch(() => props.readNextCartaFlag.value, async () => {
  if (props.readNextCartaFlag.value) {
    playAudio()
    emits('resetAudioFlag')
  }
})

onMounted(() => {
  playAudio()
})
</script>

<template>
  <div>
    <audio ref="audioPlayer">
      <source :src="questionSrc">
    </audio>
  </div>
</template>
