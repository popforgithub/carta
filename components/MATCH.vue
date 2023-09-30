<script setup lang="ts">
type Room = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  playerIds: Array<string>
  audienceIds: Array<string>
}
type CardSet = {
  id: string
  name: string
}

const props = defineProps<{
  roomId: Ref<string>
}>()

const { data: room } = await useFetch('/api/rooms/:id',
  { 
    method: 'get',
    params: { id: props.roomId},
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
const { data: cardList } = await useFetch('/api/cards',
  { 
    method: 'get',
    params: { cardSetId: room.value.cardSetId},
    headers: {
      'Content-Type': 'application/json'
    }
  }
)

</script>

<template>
  <div>
    <div class="card-container">
      <card v-for="(card, i) in cardList" :key="i"
        :card="card"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>