<script setup lang="ts">
import { ref } from 'vue';
import ReconnectingWebSocket from 'reconnecting-websocket'

const message = ref('')
const chats = ref([])
const { data: lists } = await useLazyFetch('/api/chat',
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
  const chat = JSON.parse(event.data).echo
  chats.value.unshift(chat)
  
  await useFetch('/api/chat',
    { 
      method: 'post',
      body: { 
        content: message.value
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

const closeConnection = () => {
  // 切断
  ws.close()
}

</script>

<template>
  <div>
    <v-text-field v-model="message" label="text here"/>
    <v-btn color="success" @click="sendMessage">Send</v-btn>
    <v-list>
      <v-list-item v-for="(t, i) in chats" :key="i">
        {{ t }}
      </v-list-item>
      <v-list-item v-for="(t, i) in lists" :key="i">
        {{ t.content }}
      </v-list-item>
    </v-list>
    <NuxtLink to="/secondpage">Secondpage</NuxtLink>
  </div>
</template>