<script setup lang="ts">
type Room = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  cardSetName: string
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
  score: Ref<Score>
  nextScoreId: Ref<string>
}>()
const emits = defineEmits<{
  (e: 'takeCard', v: Score, v2: string): void
  (e: 'finishGame', v: string, v2: string): void
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
const getScoreById = async (scoreId: string) => {
  const { data: scoreResponse } = await useFetch('/api/scores/:id',
    { 
      method: 'get',
      params: { id: scoreId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return scoreResponse.value
}
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
const scoreDialog = ref(false)
const closeScoreDialog = async () => {
  scoreDialog.value = false
}
const takeCard = async (score: Score) => {
  await updateScore(score)
  await refreshScoreList()
  const updatedScore = await getScoreById(score.id)
  const nextScoreId = await pickNextCardId()
  emits("takeCard", updatedScore, nextScoreId)
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

const pickNextCardId = async () => {
  const availableCardList = await scoreList.value.filter(score => score.copiedAnswer !== '')
  if (availableCardList.length > 0) {
    const rnd = await Math.floor(Math.random() * availableCardList.length)
    const pickedScoreId = availableCardList[rnd].id
    return pickedScoreId
  } else {
    return null
  }
}

const nextScore = ref(await getScoreById(props.nextScoreId.value))

const finishGame = async (scoreId, roomId) => {
  scoreDialog.value = false
  await deleteRoom()
  emits("finishGame", scoreId, roomId)
}
const finishFlag = ref(false)
watch(() => props.nextScoreId, async () => {
  if (props.nextScoreId.value) {
    scoreDialog.value = true
    nextScore.value = await getScoreById(props.nextScoreId.value)
    refreshScoreList()
  } else {
    finishFlag.value = true
    scoreDialog.value = true
    refreshScoreList()
  }
})

const deleteRoom = async () => {
  await useFetch('/api/rooms/:id',
    { 
      method: 'delete',
      params: { id: props.roomId.value },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
</script>

<template>
  <SCOREDIALOG
    :score="props.score"
    :dialog="ref(scoreDialog)"
    :finish-flag="ref(finishFlag)"
    @closeScoreDialog="closeScoreDialog"
    @finishGame="finishGame"
  />
  <div>
    <div v-if="nextScore">{{ nextScore.question }}</div>
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