<script setup lang="ts">
const props = defineProps<{
  nextScoreId: Ref<string>
  nextScoreQuestion: Ref<string>
}>()

const questionSrc = "~/assets/cartaQuestion/linuxCommandBegginer/arigato02mayu.mp3"
const audioType = "audio/mpeg"

const audioPlayer = ref<HTMLAudioElement | null>(null)

const playAudio = async () => {
  console.log('!!!!!!!!!!!!!!!!!!!!!', audioPlayer.value)
  audioPlayer.value.play()
}

watch(() => props.nextScoreQuestion, async () => {
 playAudio()
})
</script>

<template>
  <div>
    <audio ref="audioPlayer">
      <source :src=questionSrc :type=audioType>
    </audio>
  </div>
</template>

