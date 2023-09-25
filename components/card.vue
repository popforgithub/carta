<script setup lang="ts">
type Card = {
  id: string,
  question: string,
  answer: string,
  cardSetId: string
}

type Score = {
  id: string,
  cardId: string,
  roomId: string,
  userId: string
}

const props = defineProps<{
  card: Card
}>()
const emits = defineEmits<{
  (e: 'emitScore', v: Score): void
}>()

const take = () => {
  const cardId = props.card.id
  const roomId = props.roomId
  const userId = props.sessionId
}
</script>

<template>
  <v-card
    class="mx-auto"
    width="120"
    height="160"
    @click="take"
    style="text-align: center; display: flex; align-items: center; justify-content: center;"
  >
    <v-card-text>
      <strong style="font-size: 24px">{{ props.card.answer }}</strong>
    </v-card-text>
  </v-card>
</template>