<script setup lang="ts">
const { data: roomList } = await useLazyFetch('/api/rooms',
  { 
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
)

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
}
</script>

<template>
  <v-app>
    <h1>component</h1>
    <v-list>
      <v-list-item v-for="(t, i) in roomList" :key="i">
        [id:{{ t.id }}] [name:{{ t.name }}] [isOpen:{{ t.isOpen }}] [userIds:{{ t.userIds }}]
      </v-list-item>
    </v-list>
    <v-layout>
      <v-text-field v-model="inputRoomName" label="作成するルーム名を入力してください" />
      <v-btn @click="createRoom">createRoom</v-btn>
    </v-layout>
  </v-app>
</template>