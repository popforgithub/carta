<script setup lang="ts">
const headers = ['ルーム名', '削除']
const { data: roomList, refresh } = await useLazyFetch('/api/rooms', { 
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
})

const inputRoomName = ref('')
const createRoom = async () => {
  if (inputRoomName.value) {
    await useFetch('/api/rooms',
    { 
      method: 'post',
      body: { 
        name: inputRoomName.value
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    inputRoomName.value = ''
    refresh()
  }
}
const alartMessage = ref('')
const deleteRoom = async (room) => {
  if (room.playerIds.length === 0 && room.audienceIds.length === 0) {
    await useFetch('/api/rooms/:id',
      { 
        method: 'delete',
        params: { id: room.id },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    alartMessage.value = ''
    refresh()
  } else {
    alartMessage.value = '入室中のユーザーがいるので削除できません'
  }
}

const validateNum = value => !!value || 'ルーム名は1文字以上で入力してください'
</script>

<template>
  <div class="container">
    <h1>{{ alartMessage }}</h1>
    <table border="1" height="70">
      <tr>
        <th v-for="header in headers">{{ header }}</th>
      </tr>
      <tr v-for="room in roomList">
        <td width="90%">{{ room.name }}</td>
        <td class="icon" @click="deleteRoom(room)">
          <v-icon> mdi-delete </v-icon>
        </td>
      </tr>
    </table>
    <v-text-field class="field" v-model="inputRoomName" label="作成するルーム名を入力してください" :rules="[validateNum]" />
    <v-btn class="btn" @click="createRoom">createRoom</v-btn>
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
    padding: 8px; /* セル内の余白を設定 */
    text-align: center; /* セル内のコンテンツを中央揃えにする */
    border: 1px solid #ddd; /* セルの境界線を設定 */
  }
  .icon {
    min-width: 50px;
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