<script setup lang="ts">
import { match } from 'assert';
import ReconnectingWebSocket from 'reconnecting-websocket'

const matchFlag = ref(false)
const roomId = ref('')
const score = ref()
const initialNextScoreId = ref('')
const nextScoreId = ref('')
const matchId = ref('')
const finishFlag = ref(false)

// websocket関連----------------------------------------------------------
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
  ws.send(JSON.stringify({ action: "joinRoom", body: room}))
}

const leaveRoom = (room) => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "leaveRoom", body: room}))
}

const startMatch = (room, initialNextScoreId) => {
  // サーバへのデータ送信
  ws.send(JSON.stringify({ action: "startMatch", body: [room.id, initialNextScoreId]}))
}

const takeCard = (score, nextScoreId) => {
  ws.send(JSON.stringify({ action: "takeCard", body: [score, nextScoreId]}))
}

const finishGame = (scoreId, roomId) => {
  console.log('indexfinishgame', scoreId, roomId)
  ws.send(JSON.stringify({ action: "finishGame", body: [scoreId, roomId]}))
}

const reconnectMatch = (roomID: string) => {
  roomId.value = roomID
  matchFlag.value = true
  ws.send(JSON.stringify({ action: "reconnectMatch", body: roomID}))
}

// サーバからのデータ受信時に呼ばれる
ws.onmessage = async (event) => {
  if (JSON.parse(event.data).echo) { message.value = JSON.parse(event.data).echo }
  if (JSON.parse(event.data).wsConnections) { wsConnections.value = JSON.parse(event.data).wsConnections }
  if (JSON.parse(event.data).roomId) { roomId.value = JSON.parse(event.data).roomId }
  if (JSON.parse(event.data).matchFlag) { matchFlag.value = JSON.parse(event.data).matchFlag }
  if (JSON.parse(event.data).score) { score.value = JSON.parse(event.data).score }
  if (JSON.parse(event.data).matchId) { matchId.value = JSON.parse(event.data).matchId }
  if (JSON.parse(event.data).finishFlag) {
    finishFlag.value = true
    matchFlag.value = false
  }
  if (JSON.parse(event.data).initialNextScoreId) { initialNextScoreId.value = JSON.parse(event.data).initialNextScoreId }
  if (JSON.parse(event.data).nextScoreId) { nextScoreId.value = JSON.parse(event.data).nextScoreId }
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
const reset = () => {
  location.reload()
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
      <div v-if="finishFlag">
        <RESULT 
        :matchId="ref(matchId)"
        :roomId="ref(roomId)"
        :resultFlag="true"
        @reset="reset"
        />
      </div>
      <div v-else>
        <div v-if="matchFlag && pageName==='PLAY'">
          <MATCH 
            :roomId="ref(roomId)"
            :score="ref(score)"
            :initialNextScoreId="ref(initialNextScoreId)"
            :nextScoreId="ref(nextScoreId)"
            @take-card="takeCard"
            @finish-game="finishGame"
          />
        </div>
        <div v-else>
          <div v-if="pageName==='PLAY'">
            <ROOMLIST
              :sessionId="ref(sessionUser.id)"
              :message="ref(message)"
              @reconnect-match="reconnectMatch"
              @join-room="joinRoom"
              @leave-room="leaveRoom"
              @start-match="startMatch"
            />
          </div>
          <div v-else-if="pageName==='ROOM'">
            <EDITROOM
            />
          </div>
          <div v-else-if="pageName==='CARD'">
            <EDITCARDLIST
            />
          </div>
          <div v-else="pageName==='DB'">
            <EDITDB
            />
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>
