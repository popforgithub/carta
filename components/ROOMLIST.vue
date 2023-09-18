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
  message: Ref<object>,
}>()
const sessionId = props.sessionId

const emits = defineEmits<{
  (e: 'sendRoomInfo', v: Room): void
  (e: 'startMatch', v: Room): void
  (e: 'makeRoomConnection'): void
}>()

const { data: roomList, refresh } = await useLazyFetch('/api/rooms', { 
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
})

const updateRoom = async (room: Room) => {
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

const joinFlag: Ref<boolean> = ref(false)
const joinCheck = async (isJoined) => {
  joinFlag.value = isJoined
}

const joinAsPlayer = async (room, isJoined) => {
  joinFlag.value = isJoined
  room.playerIds.push(sessionId.value)
  await updateRoom(room)
  emits('sendRoomInfo', room)
  emits('makeRoomConnection')
}

const joinAsAudience = async (room, isJoined) => {
  joinFlag.value = isJoined
  room.audienceIds.push(sessionId.value)
  await updateRoom(room)
  emits('sendRoomInfo', room)
}

const leaveRoom = async (room: Room, isJoined) => {
  joinFlag.value = isJoined
  room.playerIds = room.playerIds.filter((id: string) => id !== sessionId.value)
  room.audienceIds = room.audienceIds.filter(id => id !== sessionId.value)
  await updateRoom(room)
  emits('sendRoomInfo', room)
}

const startMatch = async (room: Room) => {
  room.isOpen = false
  await updateRoom(room)
  emits('sendRoomInfo', room)
  emits('startMatch', room)
}

const wsConnectionsRefresh = async (room: Room) => {
  emits('sendRoomInfo', room)
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

watch(() => props.message, () => {
  refresh()
})
</script>

<template>
  <div>
    <div class="card-container">
      <room v-for="(room, i) in roomList" :key="i"
        :room="room"
        :roomId="room.id"
        :roomName ="room.name"
        :roomIsOpen = "room.isOpen"
        :roomPlayerIds = "room.playerIds"
        :roomAudienceIds = "room.audienceIds"
        :sessionId = "sessionId"
        :joinFlag = "joinFlag"
        @joinCheck="joinCheck"
        @joinAsPlayer="joinAsPlayer"
        @joinAsAudience="joinAsAudience"
        @leaveRoom="leaveRoom"
        @startMatch="startMatch"
        @wsConnectionsRefresh="wsConnectionsRefresh"
      />
    </div>
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