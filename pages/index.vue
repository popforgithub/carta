<script setup lang="ts">
import ReconnectingWebSocket from 'reconnecting-websocket'
type MatchRoom = {
  id: string,
  memberIds: string[]
}
const matchFlag = ref(false)

// websocket関連----------------------------------------------------------
const matchRoom: Ref<MatchRoom> = ref({id: '', memberIds: []})
const message = ref({})
const wsConnections = ref(0)
// WebSocketのクライアントの生成
let ws = new ReconnectingWebSocket("ws://localhost:5000")

//接続通知
ws.onopen = async (event) => {
  console.log(event.type, event)
}

const joinRoom = (room) => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "joinRoom" ,body: room}))
}

const leaveRoom = (room) => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "leaveRoom" ,body: room}))
}

const sendMessageToRoom = (matchRoom) => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "sendMessageToRoom" ,body: matchRoom}))
}


// サーバからのデータ受信時に呼ばれる
ws.onmessage = async (event) => {
  if (JSON.parse(event.data).echo) { message.value = JSON.parse(event.data).echo }
  if (JSON.parse(event.data).wsConnections) { wsConnections.value = JSON.parse(event.data).wsConnections }
  if (JSON.parse(event.data).matchRoom) { matchRoom.value = JSON.parse(event.data).matchRoom }
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

const startMatch = async (room) => {
  const roomMemberIds = []
  roomMemberIds.push(room.playerIds)
  roomMemberIds.push(room.audienceIds)
  roomMemberIds.flat()
  matchRoom.value.id = room.id
  matchRoom.value.memberIds = roomMemberIds
  sendMessageToRoom(matchRoom.value)
  // matchFlag.value = memberIds.includes(sessionUser.value.id)
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
          @join-room="joinRoom"
          @leave-room="leaveRoom"
          @start-match="startMatch"
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
