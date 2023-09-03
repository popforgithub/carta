<script setup lang="ts">
import ReconnectingWebSocket from 'reconnecting-websocket'

// websocket関連----------------------------------------------------------
const message = ref({})
const wsConnections = ref(0)
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

const makeRoomConnection = (room) => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "makeRoomConnections" ,body: room}))
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
// -------------------------------------------------------------------------

const isRecognized = ref(false)
const pageName = ref('PLAY')
const pageSelect = async (pagename) => {
  pageName.value = pagename
}
const sessionUser: Ref<{id: string, name: string}> = ref()

const receiveSessionUser = async (user) => {
  sessionUser.value = user
  isRecognized.value = true
}
</script>

<template>
  <v-app>
    <div v-if="!isRecognized">
      <SESSION
        @receive-session-user="receiveSessionUser"
      />
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
      <div v-else="pageName==='DB'">
        <EDITDB
        />
      </div>
    </div>
  </v-app>
</template>
