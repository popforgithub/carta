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
type Room = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  playerIds: Array<string>
  audienceIds: Array<string>
  matchId: string
}
const props = defineProps<{
  matchId: Ref<string>
  roomId: Ref<string>
  resultFlag: boolean
}>()
const emits = defineEmits<{
  (e: 'closeScoreDialog'): void
  (e: 'finishGame', v: string, v2: string): void
  (e: 'reset'): void
}>()

const dialog = ref(props.resultFlag)
const { data: scoreList } = await useFetch('/api/scores',
  { 
    method: 'get',
    params: { matchId: props.matchId},
    headers: {
      'Content-Type': 'application/json'
    }
  }
)

// userIdごとにグループ化するためのマップを作成
const groupedScores = scoreList.value.reduce((result, score) => {
  const { userId, ...rest } = score
  if (!result[userId]) {
    result[userId] = []
  }
  result[userId].push({ userId, ...rest })
  return result
}, {} as Record<string, Score[]>)
// groupedScoresをuserIdのScore数で降順にソート
const sortedGroupedScores = Object.entries(groupedScores).sort(
  ([userIdA, scoresA], [userIdB, scoresB]) => scoresB.length - scoresA.length
)
const closeDialog = async () => {
  dialog.value = false
  emits('reset')
}
</script>

<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="auto"
    >
      <v-card>
        <v-card-title class="text-h5">
          優勝は{{ sortedGroupedScores[0][1][0].userName }}さんです！
          おめでとうございます！
        </v-card-title>
        <v-card-text>
          <div v-for="user in sortedGroupedScores">
            {{ user[1][0].userName }} さん ： {{ user[1].length }} 枚
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="closeDialog"
          >
            閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
