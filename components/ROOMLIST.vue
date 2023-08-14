<script setup lang="ts">
const { data: roomList, refresh } = await useLazyFetch('/api/rooms',
  { 
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
const userIds = []
const inputUpdateRoomId: Ref<string> = ref('')
const inputUpdateRoomIsOpen = ref()
const inputUpdateRoomUserIds = ref()
const updateRoom = async () => {
  userIds.push(inputUpdateRoomUserIds.value)
  await useFetch('/api/rooms/:id',
    { 
      method: 'put',
      params: {
        id: inputUpdateRoomId,
        isOpen: inputUpdateRoomIsOpen,
        userIds: userIds
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}

const inputRoomName: Ref<string> = ref('')
const createRoom = async () => {
  await useFetch('/api/rooms',
    { 
      method: 'post',
      body: { 
        name: inputRoomName
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}

const inputRoomId: Ref<string> = ref('')
const deleteRoom = async () => {
  await useFetch('/api/rooms/:id',
    { 
      method: 'delete',
      params: { id: inputRoomId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}

let roomDetail = ref()
const inputDetailedRoomId: Ref<string> = ref('')
const searchRoom = async () => {
  roomDetail.value = await useFetch('/api/rooms/:id',
    { 
      method: 'get',
      params: { id: inputDetailedRoomId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
</script>

<template>
  <v-app>
    <div class="card-container">
      <room />
      <room />
      <room />
    </div>
    <v-list>
      <v-list-item v-for="(t, i) in roomList" :key="i">
        {{ t }}
      </v-list-item>
    </v-list>
    <v-text-field v-model="inputUpdateRoomId" label="更新するルームIDを入力してください" />
    <v-text-field v-model="inputUpdateRoomIsOpen" label="更新するルーム開閉フラグを入力してください" />
    <v-text-field v-model="inputUpdateRoomUserIds" label="更新するルームの入室ユーザーIDを入力してください" />
    <v-btn @click="updateRoom">updateRoom</v-btn>
    <v-text-field v-model="inputRoomName" label="作成するルーム名を入力してください" />
    <v-btn @click="createRoom">createRoom</v-btn>
    <v-text-field v-model="inputRoomId" label="削除するルームIDを入力してください" />
    <v-btn @click="deleteRoom">deleteRoom</v-btn>
    <v-text-field v-model="inputDetailedRoomId" label="検索したいルームIDを入力してください" />
    <v-btn @click="searchRoom">searchRoom</v-btn>
    {{ roomDetail }}
  </v-app>
</template>

<style scoped lang="scss">
    .card-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 2% 0;
  }
</style>
