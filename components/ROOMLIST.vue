<script setup lang="ts">

type Room = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  cardSetName: string
  playerIds: Array<string>
  audienceIds: Array<string>
  matchId: string
}

const props = defineProps<{
  sessionId: Ref<string>,
  message: Ref<object>,
}>()
const sessionId = props.sessionId

const emits = defineEmits<{
  (e: 'reconnectMatch', v: string): void
  (e: 'joinRoom', v: Room): void
  (e: 'leaveRoom', v: Room): void
  (e: 'startMatch', v: Room, v2: string): void
}>()

const { data: roomList, refresh } = await useFetch('/api/rooms', { 
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
})

const reconnectMatch = () => {
  for (const room of JSON.parse(JSON.stringify(roomList.value))) {
    const roomMemberIds = []
    roomMemberIds.push(room.playerIds)
    roomMemberIds.push(room.audienceIds)
    if (room.isOpen === false && roomMemberIds.flat().includes(props.sessionId.value)) {
      emits('reconnectMatch', room.id)
    }
  }
}
reconnectMatch()

const updateRoom = async (room: Room) => {
  await useFetch('/api/rooms/:id',
    { 
      method: 'put',
      params: {
        id: room.id,
        name: room.name,
        isOpen: room.isOpen,
        cardSetId: room.cardSetId,
        cardSetName: room.cardSetName,
        playerIds: room.playerIds,
        audienceIds: room.audienceIds,
        matchId: room.matchId
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
  emits('joinRoom', room)
}

const joinAsAudience = async (room, isJoined) => {
  joinFlag.value = isJoined
  room.audienceIds.push(sessionId.value)
  await updateRoom(room)
  emits('joinRoom', room)
}

const leaveRoom = async (room: Room, isJoined) => {
  joinFlag.value = isJoined
  room.playerIds = room.playerIds.filter((id: string) => id !== sessionId.value)
  room.audienceIds = room.audienceIds.filter(id => id !== sessionId.value)
  await updateRoom(room)
  emits('leaveRoom', room)
}

const isDialogActive: Ref<boolean> = ref(false)
const roomInfoForDialog = ref()
const openDialog = (room) => {
  isDialogActive.value = true
  roomInfoForDialog.value = room
}
const closeDialog = () => {
  isDialogActive.value = false
}

const startMatch = async (room: Room) => {
  room.isOpen = false
  await updateRoom(room)
  const initialNextScoreId: string = await getInitialNextScoreId(room)
  emits('startMatch', room, initialNextScoreId)
}

const getInitialNextScoreId = async (room: Room)  => {
  const { data: scoreList } = await useFetch('/api/scores',
    { 
      method: 'get',
      params: { matchId: room.matchId},
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  const rnd = Math.floor(Math.random() * scoreList.value.length)
  const initialNextScoreId = scoreList.value[rnd].id  
  return initialNextScoreId
}

watch(() => props.message, () => {
  refresh()
})
</script>

<template>
  <MATCHDIALOG
    :isActive="isDialogActive"
    :room="roomInfoForDialog"
    @startMatch="startMatch"
    @close="closeDialog"
  />
  <div>
    <div class="room-container">
      <room v-for="(room, i) in roomList" :key="i"
        :room="room"
        :sessionId = "sessionId"
        :joinFlag = "joinFlag"
        @joinCheck="joinCheck"
        @joinAsPlayer="joinAsPlayer"
        @joinAsAudience="joinAsAudience"
        @leaveRoom="leaveRoom"
        @openDialog="openDialog"
        @startMatch="startMatch"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
    .room-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 2% 0;
  }
</style>