<script setup lang="ts">
type CardSet = {
  id: string,
  name: string
}
type Card = {
  id: string,
  question: string,
  answer: string,
  cardSetId: string
}

const props = defineProps<{
  cardSet: CardSet
}>()

const emits = defineEmits<{
  (e: 'finishEdit'): void
}>()

const headers = ['上：読み札 / 下：取り札', '編集', '削除']
const { data: cardList, refresh } = await useLazyFetch('/api/cards', { 
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    cardSetId: props.cardSet.id
  },
})

const inputQuestion = ref('')
const inputAnswer = ref('')
const createCard = async () => {
  await useFetch('/api/cards', { 
    method: 'post',
    body: { 
      question: inputQuestion.value,
      answer: inputAnswer.value,
      cardSetId: props.cardSet.id
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  inputQuestion.value = ''
  inputAnswer.value = ''
  refresh()
}

const callEditForm = (card: Card) => {
}

const editCard = async (card: Card) => {
  await useFetch('/api/cards/:id',
  { 
    method: 'put',
    body: {
      id: card.id,
      question: inputQuestion.value,
      answer: inputAnswer.value,
      cardSetId: card.cardSetId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
const deleteCard = async (card: Card) => {
  await useFetch('/api/cards/:id',
    { 
      method: 'delete',
      params: { id: card.id },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}
const finishEdit = () => {
  emits('finishEdit')
}
</script>

<template>
  <div class="container">
    <v-btn class="btn" @click="finishEdit">finishEdit</v-btn>
    <h3>{{ $props.cardSet.name }} {{ cardList.length }}枚</h3>
    <table border="1" height="70">
      <tr>
        <th v-for="header in headers">{{ header }}</th>
      </tr>
      <template v-for="card in cardList" :key="card.id">
        <tr>
          <td class="content" width="80%">{{ card.question }}</td>
          <td class="icon" @click="callEditForm(card)">
            <v-icon>mdi-pencil</v-icon>
          </td>
          <td rowspan="2" class="icon" @click="deleteCard(card)">
            <v-icon>mdi-delete</v-icon>
          </td>
        </tr>
        <tr>
          <td class="content" width="80%">{{ card.answer }}</td>   
          <td class="icon" @click="callEditForm(card)">
            <v-icon>mdi-pencil</v-icon>
          </td>       
        </tr>
      </template>
    </table>
    <v-text-field class="field" v-model="inputQuestion" label="作成する読み札を入力してください" />
    <v-text-field class="field" v-model="inputAnswer" label="作成する取り札を入力してください" />
    <v-btn class="btn" @click="createCard">createCard</v-btn>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    text-align: center; /* コンテンツを中央に寄せる */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  table {
    width: 80%; /* テーブル幅を100%に設定 */
    border-collapse: separate; /* セルの間の余白をなくす */
    border-spacing: 0px 0px;
    margin: auto; /* 水平方向に中央に寄せる */
    margin-top: 3%;
    margin-bottom: 3%;
  }
  th, td {
    min-width: 50px;
    padding: 8px; /* セル内の余白を設定 */
    text-align: center; /* セル内のコンテンツを中央揃えにする */
    border: 1px solid #ddd; /* セルの境界線を設定 */
  }
  .icon {
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s; /* ホバー時のスタイル変化をアニメーション化 */
  }

  .icon:hover {
    background-color: lightgray; /* ホバー時の背景色を変更 */
  }
  .field {
    width: 80%;
    margin:auto;
  }
  .btn {
    margin:1%;
  }
</style>