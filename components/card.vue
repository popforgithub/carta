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
  score: Score
}>()
const emits = defineEmits<{
  (e: 'takeCard', v: Score): void
}>()

const take = () => {
  emits('takeCard', props.score)
}
</script>

<template>
  <v-card :disabled="!props.score.copiedAnswer"
    class="mx-auto"
    @click="take"
    style="text-align: center; display: flex; align-items: center;"
  >
    <v-card-text>
      <strong style="font-size: 24px">{{ props.score.copiedAnswer }}</strong>
    </v-card-text>
  </v-card>
</template>