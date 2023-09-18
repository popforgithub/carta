<script setup lang="ts">
import { isJsxOpeningElement } from 'typescript';

type Room = {
  id: string,
  name: string,
  isOpen: boolean,
  playerIds: Array<string>
  audienceIds: Array<string>
}

const props = defineProps<{
  sessionId: string
  room: Room
  roomInfo: { roomId: string, connectionIds: string[] } | undefined
  joinFlag: boolean
}>()
const sessionId = ref(props.sessionId)
const roomInfo = ref()
const joinFlag = ref(props.joinFlag)
const isReady = ref(false)
const emits = defineEmits<{
  (e: 'joinCheck', b: boolean): void
  (e: 'joinAsPlayer', v: Room, b: boolean): void
  (e: 'joinAsAudience', v: Room, b: boolean): void
  (e: 'leaveRoom', v: Room, b: boolean): void
  (e: 'iAmReady', v: string): void
  (e: 'startMatch', v: Room): void
  (e: 'wsConnectionsRefresh', v: Room): void
}>()

const getUserNamesByUserId = async (userIds: Array<string>): Promise<Array<string>> => {
  const userNames: Array<string> = await Promise.all(userIds.map(async (userId) => {
    if (userId) {
      const { data: userResponse } = await useFetch('/api/users/:id', { 
        method: 'get',
        params: { id: userId },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { name } = userResponse.value
      if (name) { return name }
    }
  }))
  return userNames
}
const playerNames: Ref<Array<string>> = ref([])
const audienceNames: Ref<Array<string>> = ref([])
const refreshUserNames = async () => {
  playerNames.value = await getUserNamesByUserId(props.room.playerIds)
  audienceNames.value = await getUserNamesByUserId(props.room.audienceIds)
  joinFlag.value = props.joinFlag
}
refreshUserNames()

const isJoined: Ref<boolean> = ref()
if (props.room.playerIds.find((id: string) => id === sessionId.value) || props.room.audienceIds.find(id => id === sessionId.value)) {
  isJoined.value = true
  emits('joinCheck', isJoined.value)
} else {
  isJoined.value = false
}

const joinAsPlayer = async () => {
  isJoined.value = true
  emits('joinAsPlayer', props.room, isJoined.value)
}
const joinAsAudience = async () => {
  isJoined.value = true
  emits('joinAsAudience', props.room, isJoined.value)
}
const leaveRoom = async () => {
  isJoined.value = false
  emits('leaveRoom', props.room, isJoined.value)
}
const iAmReady = async () => {
  isReady.value = true
  emits('iAmReady', props.room.id)
}
const startMatch = async () => {
  emits('startMatch', props.room)
}

watch(() => props.room, () => {
  refreshUserNames()
})

watch(() => props.roomInfo, () => {
  if (props.roomInfo && props.roomInfo.roomId === props.room.id) {
    roomInfo.value = props.roomInfo
  }
})

// components読み込み時にws接続数を更新
emits('wsConnectionsRefresh', props.room)
</script>

<template>
  <v-card class="mx-auto" variant="outlined" :disabled="!props.room.isOpen">
    <v-card-item>
      <div class="text-center">
        <div class="room-name text-h6 mb-1">
          {{ props.room.name }}
          <h6 v-if="props.room.isOpen" style="color: limegreen;">エントリー受付中</h6>
          <h6 v-if="!props.room.isOpen" style="color: red;">試合中</h6>
        </div>
        <h6>参加者</h6>
        <v-list class="players-list">
          <div class="players" v-for="(playerName, i) in playerNames" :key="i">
            {{ playerName }}
          </div>
        </v-list>
        <h6>観戦者</h6>
        <v-list class="audiences-list">
          <div class="audiences" v-for="(audienceName, i) in audienceNames" :key="i">
            {{ audienceName }}
          </div>
        </v-list>
        <h5 v-if="roomInfo && roomInfo.roomId === props.room.id">
          {{ roomInfo.connectionIds.length }} 人 / {{ props.room.playerIds.length + props.room.audienceIds.length }} 人 が準備完了です
        </h5>
      </div>
    </v-card-item>

    <v-card-actions class="border" style="display: flex; justify-content: space-around;" :disabled="!props.room.isOpen">
      <v-btn v-if="!isJoined" variant="outlined" class="border" @click="joinAsPlayer" :disabled="joinFlag">
        参加
      </v-btn>
      <v-btn v-if="!isJoined" variant="outlined" class="border" @click="joinAsAudience" :disabled="joinFlag">
        観戦
      </v-btn>
      <v-btn v-if="isJoined && !isReady" variant="outlined" class="border" @click="leaveRoom">
        退室
      </v-btn>
      <v-btn v-if="isJoined &&!isReady" variant="outlined" class="border" :disabled="!isJoined && joinFlag" @click="iAmReady">
        準備完了
      </v-btn>
      <v-btn v-if="isJoined && isReady" variant="outlined" class="border" @click="startMatch">
        試合開始
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
@import '@/assets/main';
.v-card {
  margin: 2%;
  width: 40%;
  @include mobile {
    width: 80%;
  }
}
  .players-list,.audiences-list{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap
  }
  .players,.audiences {
    padding: 0 2%;
    color: limegreen;
  }
</style>