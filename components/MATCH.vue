<script setup lang="ts">
type Room = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  playerIds: Array<string>
  audienceIds: Array<string>
  matchId: string
}
type CardSet = {
  id: string
  name: string
}
type ScoreProps = {
  cardId: string,
  roomId: string,
  userId: string,
  userName: string,
  matchId: string
}

const props = defineProps<{
  roomId: Ref<string>
  }>()
  
const session = useCookie('session')
const { data: room } = await useFetch('/api/rooms/:id',
  { 
    method: 'get',
    params: { id: props.roomId.value},
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

const { data: scoreList, refresh } = await useFetch('/api/scores',
  { 
    method: 'get',
    params: { matchId: room.value.matchId},
    headers: {
      'Content-Type': 'application/json'
    }
  }
)

const scoredUser = ref({id: '', name: ''})
const takeCard = async (cardId: string) => {
  scoredUser.value = await findUserById(session.value)
  await useFetch('/api/scores', {
    method: 'post',
    body: { 
      cardId: cardId,
      roomId: room.value.id,
      userId: session.value,
      userName: scoredUser.value.name,
      matchId: room.value.matchId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  refresh()
}

const findUserById = async (session: string) => {
  const { data: userResponse } = await useFetch('/api/users/:id',
    { 
      method: 'get',
      params: { id: session},
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return userResponse.value
}
</script>

<template>
  <div>
    <div class="card-container">
      <card class="card-item" v-for="(card, i) in cardList" :key="i"
        :card="card"
        @takeCard="takeCard"
      />
    </div>
    {{ scoreList }}
  </div>
</template>

<style lang="scss" scoped>
.card-container {
	display: flex;
	flex-wrap: wrap;
	margin: calc(-30px / 2);
	padding: 30px;
}

.card-item {
	width: calc(100% / 6 - 30px);
	margin: calc(30px / 2);
}
</style>