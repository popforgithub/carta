<script setup lang="ts">
const { data: scoreList, refresh } = await useFetch('/api/scores', { 
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
})

const { data: scoreResponse } = await useFetch('/api/scores/:id', { 
  method: 'get',
  params: { id: 'aaa' },
  headers: {
    'Content-Type': 'application/json'
  }
})

const inputScoreQuestion = ref('')
const inputScoreAnswer = ref('')
const createScore = async () => {
  if (inputScoreQuestion.value) {
    await useFetch('/api/scores',
      { 
        method: 'post',
        body: { 
          question: inputScoreQuestion,
          answer: inputScoreAnswer,
          scoreSetId: 'aaa'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    refresh()
  }
}
const deleteScore = async (scoreId) => {
  await useFetch('/api/scores/:id',
    { 
      method: 'delete',
      params: { id: scoreId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}
</script>

<template>
  <div>
    試合中
  </div>
  <p>{{ scoreList }}</p>
  <h1>{{ scoreResponse }}</h1>
  <v-text-field class="field" v-model="inputScoreQuestion" label="作成する質問を入力してください" />
  <v-text-field class="field" v-model="inputScoreAnswer" label="作成する答えを入力してください" />
  <v-btn class="btn" @click="createScore">createScore</v-btn>
  <v-btn class="btn" @click="deleteScore('01HB3KESKN0DZJ6EPADT5W6493')">deleteScore</v-btn>
</template>

<style lang="scss" scoped>
</style>