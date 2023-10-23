<script setup lang="ts">
type CardSet = {
  id: string,
  name: string
}
const headers = ['カルタ名', '編集', '削除']
const { data: cardSetList, refresh } = await useLazyFetch('/api/card_sets', { 
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
})

const inputCardSetName = ref('')
const createCardSet = async () => {
  if (inputCardSetName.value) {
    await useFetch('/api/card_sets',
    { 
      method: 'post',
      body: { 
        name: inputCardSetName.value
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    inputCardSetName.value = ''
    refresh()
  }
}
const cardSet: Ref<CardSet> = ref()
const editFlag = ref(false)
const editCardSet = async (selectedCardSet: CardSet) => {
  editFlag.value = true
  cardSet.value = selectedCardSet
}
const deleteCardSet = async (cardSet: CardSet) => {
  await useFetch('/api/card_sets/:id',
    { 
      method: 'delete',
      params: { id: cardSet.id },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}
const finishEditCard = () => {
  editFlag.value = false
}
const validateNum = value => !!value || 'カルタ名は1文字以上で入力してください'
</script>

<template>
  <div v-if="!editFlag" class="container">
    <table border="1" height="70">
      <tr>
        <th v-for="header in headers">{{ header }}</th>
      </tr>
      <tr v-for="cardSet in cardSetList" :key="cardSet.id">
        <td width="80%">{{ cardSet.name }}</td>
        <td class="icon" @click="editCardSet(cardSet)">
          <v-icon>mdi-pencil</v-icon>
        </td>
        <td class="icon" @click="deleteCardSet(cardSet)">
          <v-icon>mdi-delete</v-icon>
        </td>
      </tr>
    </table>
    <v-text-field class="field" v-model="inputCardSetName" label="作成するカルタ名を入力してください" :rules="[validateNum]" />
    <v-btn class="btn" @click="createCardSet">createCardSet</v-btn>
  </div>
  <div v-else>
    <EDITCARD
      :cardSet="cardSet"
      @finishEdit="finishEditCard"
    />
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
    border-collapse: collapse; /* セルの間の余白をなくす */
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