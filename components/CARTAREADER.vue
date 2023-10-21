<script setup lang="ts">
const props = defineProps<{
  nextScoreId: Ref<string>
  nextScoreQuestion: Ref<string>
  readNextCartaFlag: Ref<boolean>
}>()
const emits = defineEmits<{
  (e: 'resetAudioFlag'): void
}>()
const questionSrc = "/assets/cartaQuestion/linuxCommandBegginer/arigato02mayu.mp3"
const audioPlayer = ref<HTMLAudioElement | null>(null)

const playAudio = async () => {
  audioPlayer.value.play()
}

watch(() => props.readNextCartaFlag.value, async () => {
  { playAudio() } if (props.readNextCartaFlag.value)
  emits('resetAudioFlag')
})
</script>

<template>
  <div>
    <audio ref="audioPlayer">
      <source :src=questionSrc>
    </audio>
  </div>
</template>
