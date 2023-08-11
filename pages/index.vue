<script setup lang="ts">
import { ref } from 'vue';
import ReconnectingWebSocket from 'reconnecting-websocket'
import { ulid } from 'ulidx';
import User from '~/domain/User';

const session = useCookie('session')

const inputUserName: Ref<string> = ref('')
let sessionUser: Ref<{id: string, name: string}> = ref()
const inputUserId: string = ''
const { data: userList } = await useLazyFetch('/api/users',
  { 
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
// WebSocketのクライアントの生成
let ws = new ReconnectingWebSocket("ws://localhost:5000")

//接続通知
ws.onopen = async (event) => {
  console.log(event.type, event)
}

const sendMessage = () => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "sendMessageToAll" ,body: message.value }))
}

// サーバからのデータ受信時に呼ばれる
ws.onmessage = async (event) => {
  // const senderId = JSON.parse(event.data).id 
  // const user = JSON.parse(event.data).echo
  // users.value.unshift(user)
//   await useFetch('/api/users',
//     { 
//       method: 'post',
//       body: { 
//         content: message.value
//       },
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     }
//   )
}

const closeConnection = () => {
  // 切断
  ws.close()
}

const findUserById = async (session) => {
  const { data: userResponse } = await useFetch('/api/users/:id',
    { 
      method: 'get',
      params: { id: session},
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return userResponse
}
if (session) {
  sessionUser = await findUserById(session)
}

const createUser = async () => {
  session.value = ulid()
  await useFetch('/api/users',
    { 
      method: 'post',
      body: { 
        id: session,
        name: inputUserName
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

const deleteUser = async () => {
  await useFetch('/api/users/:id',
    { 
      method: 'delete',
      params: { id: inputUserId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
</script>

<template>
  <div v-if="!session || sessionUser.id === 'undefined'">
    <v-text-field v-model="inputUserName" label="あなたの名前を入力してください"/>
    <v-btn @click="createUser">createUser</v-btn>
    <v-list>
      <v-list-item v-for="(t, i) in userList" :key="i">
        [id:{{ t.id }}] [name:{{ t.name }}]
      </v-list-item>
    </v-list>
    <NuxtLink to="/user">Chat</NuxtLink>
  </div>
  <div v-else>
    こんにちは {{ sessionUser.name }} さん
    <v-list>
      <v-list-item v-for="(t, i) in userList" :key="i">
        [id:{{ t.id }}] [name:{{ t.name }}]
      </v-list-item>
    </v-list>
    <NuxtLink to="/user">Chat</NuxtLink>
  </div>
</template>
