<script setup lang="ts">
import { ref } from 'vue';
import ReconnectingWebSocket from 'reconnecting-websocket'
import { ulid } from 'ulidx';

const session = useCookie('session')
const message = ref({})
const wsConnections = ref(0)

const pageName = ref('PLAY')

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

const sendRoomInfo = (room) => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "sendMessageToAll" ,body: room}))
}

// サーバからのデータ受信時に呼ばれる
ws.onmessage = async (event) => {
  message.value = JSON.parse(event.data).echo
  wsConnections.value = JSON.parse(event.data).wsConnections
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
  if (inputUserName.value) {
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

const pageSelect = async (pagename) => {
  pageName.value = pagename
}

const validateNum = value => !!value || 'お名前を1文字以上で入力してください'
</script>

<template>
  <v-app>
    <div v-if="!session">
      <v-text-field v-model="inputUserName" label="あなたの名前を入力してください" :rules="[validateNum]" />
      <v-btn @click="createUser">createUser</v-btn>
      <v-list>
        <v-list-item v-for="(t, i) in userList" :key="i">
          [id:{{ t.id }}] [name:{{ t.name }}]
        </v-list-item>
      </v-list>
      <NuxtLink to="/user">Chat</NuxtLink>
    </div>
    <div v-else>
      <HEADER
        :sessionUserName="ref(sessionUser.name)"
        :wsConnections="ref(wsConnections)"
        @pageSelect="pageSelect"
      />
      <div v-if="pageName==='PLAY'">
        <ROOMLIST
          :sessionId="ref(sessionUser.id)"
          :message="ref(message)"
          @sendRoomInfo="sendRoomInfo"
        />
      </div>
      <div v-else-if="pageName==='ROOM'">
        <EDITROOM
        />
      </div>
      こんにちは {{ sessionUser.name }} さん
      <v-list>
        <v-list-item v-for="(t, i) in userList" :key="i">
          [id:{{ t.id }}] [name:{{ t.name }}]
        </v-list-item>
      </v-list>
      <NuxtLink to="/user">Chat</NuxtLink>
    </div>
  </v-app>
</template>
