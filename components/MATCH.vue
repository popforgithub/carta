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
  roomId: Ref<string>
  scoreId: Ref<string>
}>()
const emits = defineEmits<{
  (e: 'takeCard', v: Score): void
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

const { data: scoreList, refresh: refreshScoreList } = await useFetch('/api/scores',
  { 
    method: 'get',
    params: { matchId: room.value.matchId},
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
const scoredUser = ref({id: '', name: ''})
const updateScore = async (score: Score) => {
  scoredUser.value = await findUserById(session.value)
  await useFetch('/api/scores/:id',
    { 
      method: 'put',
      params: { 
        id: score.id,
        cardId: score.cardId,
        question: score.question,
        answer: score.answer,
        cardSetId: score.cardSetId,
        cardSetName: score.cardSetName,
        copiedAnswer: '',
        roomId: score.roomId,
        userId: scoredUser.value.id,
        userName: scoredUser.value.name,
        matchId: score.matchId
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
const takeCard = async (score: Score) => {
  await updateScore(score)
  emits("takeCard", score)
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
watch(() => props.scoreId.value, () => {
  console.log('1111111111111111111111111111', props.scoreId.value)
  refreshScoreList()
})
</script>

<template>
  <div>
    <div class="card-container">
      <card class="card-item" v-for="(score, i) in scoreList" :key="i"
        :score="score"
        @takeCard="takeCard"
      />
    </div>
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