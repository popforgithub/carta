import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"
import RoomId from "~/domain/Room/RoomId"

type RoomResponse = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  cardSetName: string
  playerIds: Array<string>
  audienceIds: Array<string>
}

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const roomId = new RoomId(paramsId)
  const repository = new roomDynamoDBRepository()
  const room = await repository.findById(roomId)
  const roomResponse: RoomResponse = {
    id: room.id.value,
    name: room.name,
    isOpen: room.isOpen,
    cardSetId: room.cardSetId.value,
    cardSetName: room.cardSetName,
    playerIds: room.playerIds.map(playerId => playerId.value),
    audienceIds: room.audienceIds.map(audienceId => audienceId.value)
  }
  return roomResponse
})