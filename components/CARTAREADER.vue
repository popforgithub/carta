<script setup lang="ts">
import { filename } from 'pathe/utils'
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

const questionSrc = ref(props.nextScore.value.answer)
const glob = import.meta.glob('@/assets/cartaQuestion/LinuxCommandBeginner/*.mp3', { eager: true })
const audio = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
)
// const updateQuestionSrc = async (scoreId: string) => {
//   console.log('!!!!!!!!', props.nextScore.value.cardSetName, props.nextScore.value.answer)
//   questionSrc.value = new URL(`/assets/cartaQuestion/${props.nextScore.value.cardSetName}/${props.nextScore.value.answer}.mp3`, import.meta.url).href
//   // questionSrc.value = new URL(`/assets/cartaQuestion/LinuxCommandBeginner/cat.mp3`, import.meta.url).href
//   console.log('!!!!!!!!', questionSrc.value)
// }
const audioPlayer = ref<HTMLAudioElement | null>(null)

const playAudio = async () => {
  audioPlayer.value.load()
  audioPlayer.value.play()
}

watch(() => props.nextScore.value, async () => {
  questionSrc.value = props.nextScore.value.answer
  playAudio()
  emits('resetAudioFlag')
})
</script>

<template>
  <div>
    <audio ref="audioPlayer">
      <source :src="audio[`${questionSrc}`]">
    </audio>
    {{ audio[`${questionSrc}`] }}
  </div>
</template>
