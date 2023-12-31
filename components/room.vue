<script setup lang="ts">

type Room = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  cardSetName: string
  playerIds: Array<string>
  audienceIds: Array<string>
}

const props = defineProps<{
  sessionId: string
  room: Room
  joinFlag: boolean
}>()
const sessionId = ref(props.sessionId)
const joinFlag = ref(props.joinFlag)
const emits = defineEmits<{
  (e: 'joinCheck', b: boolean): void
  (e: 'joinAsPlayer', v: Room, b: boolean): void
  (e: 'joinAsAudience', v: Room, b: boolean): void
  (e: 'leaveRoom', v: Room, b: boolean): void
  (e: 'openDialog', v: Room): void
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
const openDialog = async (room: Room) => {
  emits('openDialog', room)
}

watch(() => props.room, () => {
  refreshUserNames()
})

</script>

<template>
  <v-card class="mx-auto" variant="outlined" :disabled="!props.room.isOpen">
    <v-card-item>
      <div class="text-center">
        <p class="text-h5 mb-1">{{ props.room.name }}</p>
        <p class="text-h6 mb-1">{{ props.room.cardSetName }}</p>
        <h6 v-if="props.room.isOpen" style="color: limegreen;">エントリー受付中</h6>
        <h6 v-if="!props.room.isOpen" style="color: red;">試合中</h6>
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
      </div>
    </v-card-item>

    <v-card-actions class="border" style="display: flex; justify-content: space-around;" :disabled="!props.room.isOpen">
      <v-btn v-if="!isJoined" variant="outlined" class="border" @click="joinAsPlayer" :disabled="joinFlag">
        参加
      </v-btn>
      <v-btn v-if="!isJoined" variant="outlined" class="border" @click="joinAsAudience" :disabled="joinFlag">
        観戦
      </v-btn>
      <v-btn v-if="isJoined" variant="outlined" class="border" @click="leaveRoom">
        退室
      </v-btn>
      <v-btn v-if="isJoined" variant="outlined" class="border" :disabled="!isJoined && joinFlag" @click="openDialog(props.room)">
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
  flex-wrap: wrap;
}
.players,.audiences {
  padding: 0 2%;
  color: limegreen;
}
</style>