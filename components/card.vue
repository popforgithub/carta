<script setup lang="ts">
type Card = {
  id: string,
  question: string,
  answer: string,
  cardSetId: string
}

const props = defineProps<{
  card: Card
}>()
const emits = defineEmits<{
  (e: 'takeCard', v: string): void
}>()

const take = () => {
  emits('takeCard', props.card.id)
}
</script>

<template>
  <v-card
    class="mx-auto"
    @click="take"
    style="text-align: center; display: flex; align-items: center;"
  >
    <v-card-text>
      <strong style="font-size: 24px">{{ props.card.answer }}</strong>
    </v-card-text>
  </v-card>
</template>