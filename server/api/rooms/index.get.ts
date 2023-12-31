import RoomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"

type RoomsResponse = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  cardSetName: string
  playerIds: Array<string>
  audienceIds: Array<string>
  matchId: string
}[]

export default defineEventHandler(async () => {
  const repository = new RoomDynamoDBRepository()
  const roomList = await repository.getAll()
  const roomsResponse: RoomsResponse = roomList.map((room) => {
  const playerIds = Array.isArray(room.playerIds) ? room.playerIds.map(playerId => playerId.value) : []
  const audienceIds = Array.isArray(room.audienceIds) ? room.audienceIds.map(audienceId => audienceId.value) : []
  return {
    id: room.id.value,
    name: room.name,
    isOpen: room.isOpen,
    cardSetId: room.cardSetId.value,
    cardSetName: room.cardSetName,
    playerIds: playerIds,
    audienceIds: audienceIds,
    matchId: room.matchId
  }
})
  
  return roomsResponse
})