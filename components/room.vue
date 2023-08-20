<script setup lang="ts">
const props = defineProps<{
  sessionId: string
  roomId: string
  roomName: string
  roomIsOpen: boolean
  roomPlayerIds: Array<string>
}>()
const sessionId = ref(props.sessionId)
const roomId = ref(props.roomId)
const roomName = ref(props.roomName)
const roomIsOpen = ref(props.roomIsOpen)
const roomPlayerIds = ref(props.roomPlayerIds)
type Room = {
  id: string,
  name: string,
  isOpen: boolean,
  playerIds: Array<string>
}
const room: Room = {
  id: roomId.value,
  name: roomName.value,
  isOpen: roomIsOpen.value,
  playerIds: roomPlayerIds.value
}

const emits = defineEmits<{
  (e: 'joinAsPlayer', v: Room): void
}>()

const getUserNamesByUserId = async (userIds: Array<string>): Promise<Array<string>> => {
  const userNames: Array<string> = await Promise.all(userIds.map(async (userId) => {
    const { data: userResponse } = await useFetch('/api/users/:id', { 
      method: 'get',
      params: { id: userId},
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const { name } = userResponse.value
    return name
  }))
  return userNames
}

const playerNames: Ref<Array<string>> = ref([])
const refreshPlayerNames = async () => {
  playerNames.value = await getUserNamesByUserId(roomPlayerIds.value)
}
refreshPlayerNames()

const joinAsPlayer = async () => {
  emits('joinAsPlayer', room)
  refreshPlayerNames()
}
</script>

<template>
  <v-card class="mx-auto" variant="outlined" :disabled="!roomIsOpen">
    <v-card-item>
      <div class="text-center">
        <div class="room-name text-h6 mb-1">
          {{ roomName }}
          <h6 v-if="roomIsOpen" style="color: limegreen;">エントリー募集中</h6>
          <h6 v-if="!roomIsOpen" style="color: red;">エントリー受付終了</h6>
        </div>
        <h6>参加者</h6>
        <v-list class="players-list">
          <div class="players" v-for="(playerName, i) in playerNames" :key="i">
            {{ playerName }}
          </div>
        </v-list>
        <h6>観戦者</h6>
        <v-list class="players-list">
          <div class="players" v-for="(playerName, i) in playerNames" :key="i">
            {{ playerName }}
          </div>
        </v-list>
      </div>
    </v-card-item>

    <v-card-actions class="border" style="display: flex; justify-content: space-around;">
      <v-btn variant="outlined" class="border" @click="joinAsPlayer">
        参加
      </v-btn>
      <v-btn variant="outlined" class="border">
        観戦
      </v-btn>
      <v-btn variant="outlined" class="border">
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
  .players-list {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap
  }
  .players {
    color: limegreen;
    padding: 0 2%;
  }
</style>