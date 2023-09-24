<script setup lang="ts">
const { data: cardList, refresh } = await useFetch('/api/cards', { 
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
})

const { data: cardResponse } = await useFetch('/api/cards/:id', { 
  method: 'get',
  params: { id: 'aaa' },
  headers: {
    'Content-Type': 'application/json'
  }
})

const inputCardQuestion = ref('')
const inputCardAnswer = ref('')
const createCard = async () => {
  if (inputCardQuestion.value) {
    await useFetch('/api/cards',
      { 
        method: 'post',
        body: { 
          question: inputCardQuestion,
          answer: inputCardAnswer,
          cardSetId: 'aaa'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    refresh()
  }
}
const deleteCard = async (cardId) => {
  await useFetch('/api/cards/:id',
    { 
      method: 'delete',
      params: { id: cardId },
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
  <p>{{ cardList }}</p>
  <h1>{{ cardResponse }}</h1>
  <v-text-field class="field" v-model="inputCardQuestion" label="作成する質問を入力してください" />
  <v-text-field class="field" v-model="inputCardAnswer" label="作成する答えを入力してください" />
  <v-btn class="btn" @click="createCard">createCard</v-btn>
  <v-btn class="btn" @click="deleteCard('01HB3KESKN0DZJ6EPADT5W6493')">deleteCard</v-btn>
</template>

<style lang="scss" scoped>
</style>