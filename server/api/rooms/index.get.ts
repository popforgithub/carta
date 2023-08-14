import RoomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"

type RoomsResponse = {
  id: string
  name: string
  isOpen: boolean
  playerIds: Array<string>
}[]

export default defineEventHandler(async () => {
  const repository = new RoomDynamoDBRepository()
  const roomList = await repository.getAll()
  const roomsResponse: RoomsResponse = roomList.map((room) => {
    const playerIds = Array.isArray(room.playerIds) ? room.playerIds.map(playerId => playerId.value) : []
    return {
      id: room.id.value,
      name: room.name,
      isOpen: room.isOpen,
      playerIds: playerIds
    }
  })
  
  return roomsResponse
})