<script setup lang="ts">
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
}>()
const sessionId = ref(props.sessionId)

const emits = defineEmits<{
  (e: 'joinAsPlayer', v: Room): void
  (e: 'joinAsAudience', v: Room): void
  (e: 'leaveRoom', v: Room): void
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
}
refreshUserNames()

const isJoined: Ref<boolean> = ref()
if (props.room.playerIds.find((id: string) => id === sessionId.value) || props.room.audienceIds.find(id => id === sessionId.value)) {
  isJoined.value = true
} else {
  isJoined.value = false
}
const joinAsPlayer = async () => {
  emits('joinAsPlayer', props.room)
  isJoined.value = true
}
const joinAsAudience = async () => {
  emits('joinAsAudience', props.room)
  isJoined.value = true
}
const leaveRoom = async () => {
  emits('leaveRoom', props.room)
  isJoined.value = false
}

watch(() => props.room, () => {
  refreshUserNames()
})
</script>

<template>
  <v-card class="mx-auto" variant="outlined" :disabled="!props.room.isOpen">
    <v-card-item>
      <div class="text-center">
        <div class="room-name text-h6 mb-1">
          {{ props.room.name }}
          <h6 v-if="props.room.isOpen" style="color: limegreen;">エントリー募集中</h6>
          <h6 v-if="!props.room.isOpen" style="color: red;">エントリー受付終了</h6>
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
      </div>
    </v-card-item>

    <v-card-actions class="border" style="display: flex; justify-content: space-around;">
      <v-btn v-if="!isJoined" variant="outlined" class="border" @click="joinAsPlayer">
        参加
      </v-btn>
      <v-btn v-if="!isJoined" variant="outlined" class="border" @click="joinAsAudience">
        観戦
      </v-btn>
      <v-btn v-if="isJoined" variant="outlined" class="border" @click="leaveRoom">
        退室
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
  .players-list,.audiences-list{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap
  }
  .players,.audiences {
    color: limegreen;
    padding: 0 2%;
  }
</style>