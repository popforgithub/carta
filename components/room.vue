<script setup lang="ts">
const props = defineProps({
  roomName: String,
  roomIsOpen: Boolean,
  roomPlayerIds: Array<String>
})
const roomName = props.roomName
const isOpen = props.roomIsOpen
const playerIds = props.roomPlayerIds
const getUserNamesByUserId = async (userIds) => {
  // if (!Array.isArray(userIds.value) || userIds.value.length === 0) {
  //   return []
  // }
  const userNames = await Promise.all(userIds.value.map(async (userId) => {
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
const playerNames = await getUserNamesByUserId(playerIds)
</script>

<template>
  <v-card class="mx-auto" variant="outlined">
    <v-card-item>
      <div class="text-center">
        <div class="room-name text-h6 mb-1">
          {{ roomName }}
        </div>
        <v-list class="players-list">
          <div class="players" v-for="(playerName, i) in playerNames" :key="i">
            {{ playerName }}
          </div>
        </v-list>
      </div>
    </v-card-item>

    <v-card-actions class="border" style="display: flex; justify-content: space-around;">
      <v-btn variant="outlined">
        参加
      </v-btn>
      <v-btn variant="outlined">
        観戦
      </v-btn>
      <v-btn variant="outlined">
        削除
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
    justify-content: space-around;
    flex-wrap: wrap
  }
  .players {
    color: red;
    padding: 0 2%;
  }
</style>