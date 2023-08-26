<script setup lang="ts">

type Room = {
  id: string,
  name: string,
  isOpen: boolean,
  playerIds: Array<string>
  audienceIds: Array<string>
}

const props = defineProps<{
  sessionId: Ref<string>,
}>()
const sessionId = props.sessionId
const { data: roomList, refresh } = await useLazyFetch('/api/rooms',
  { 
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    },
  },
)

const inputUpdateRoomId: Ref<string> = ref('')
const inputUpdateRoomIsOpen = ref()
const inputUpdateRoomUserIds = ref()

const inputRoomName: Ref<string> = ref('')
const createRoom = async () => {
  await useFetch('/api/rooms',
    { 
      method: 'post',
      body: { 
        name: inputRoomName
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}

const updateRoom = async (room) => {
  await useFetch('/api/rooms/:id',
    { 
      method: 'put',
      params: {
        id: room.id,
        isOpen: room.isOpen,
        playerIds: room.playerIds,
        audienceIds: room.audienceIds
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}

const joinAsPlayer = async (room) => {
  room.playerIds.push(sessionId.value)
  await updateRoom(room)
}

const joinAsAudience = async (room) => {
  room.audienceIds.push(sessionId.value)
  await updateRoom(room)
}

const leaveRoom = async (room: Room) => {
  room.playerIds = room.playerIds.filter((id: string) => id !== sessionId.value)
  room.audienceIds = room.audienceIds.filter(id => id !== sessionId.value)
  await updateRoom(room)
}

const inputRoomId: Ref<string> = ref('')
const deleteRoom = async () => {
  await useFetch('/api/rooms/:id',
    { 
      method: 'delete',
      params: { id: inputRoomId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  refresh()
}

let roomDetail = ref()
const inputDetailedRoomId: Ref<string> = ref('')
const searchRoom = async () => {
  roomDetail.value = await useFetch('/api/rooms/:id',
    { 
      method: 'get',
      params: { id: inputDetailedRoomId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
</script>

<template>
  <div>
    <div class="card-container">
      <room v-for="(room, i) in roomList" :key="i"
        :roomId="room.id"
        :roomName ="room.name"
        :roomIsOpen = "room.isOpen"
        :roomPlayerIds = "room.playerIds"
        :roomAudienceIds = "room.audienceIds"
        :sessionId = "sessionId"
        @joinAsPlayer="joinAsPlayer"
        @joinAsAudience="joinAsAudience"
        @leaveRoom="leaveRoom"
      />
    </div>
    <div  v-for="(room, i) in roomList" :key="i">
      {{ room }}
    </div>
    <v-text-field v-model="inputUpdateRoomId" label="更新するルームIDを入力してください" />
    <v-text-field v-model="inputUpdateRoomIsOpen" label="更新するルーム開閉フラグを入力してください" />
    <v-text-field v-model="inputUpdateRoomUserIds" label="更新するルームの入室ユーザーIDを入力してください" />
    <v-btn @click="updateRoom">updateRoom</v-btn>
    <v-text-field v-model="inputRoomName" label="作成するルーム名を入力してください" />
    <v-btn @click="createRoom">createRoom</v-btn>
    <v-text-field v-model="inputRoomId" label="削除するルームIDを入力してください" />
    <v-btn @click="deleteRoom">deleteRoom</v-btn>
    <v-text-field v-model="inputDetailedRoomId" label="検索したいルームIDを入力してください" />
    <v-btn @click="searchRoom">searchRoom</v-btn>
    {{ roomDetail }}
  </div>
</template>

<style scoped lang="scss">
    .card-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 2% 0;
  }
</style>