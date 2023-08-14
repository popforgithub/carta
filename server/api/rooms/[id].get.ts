import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"
import RoomId from "~/domain/Room/RoomId"

type RoomResponse = {
  id: string,
  name: string,
  isOpen: boolean,
  userIds: Array<string>
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
    userIds: room.userIds.map(userId => userId.value)
  }
  return roomResponse
})