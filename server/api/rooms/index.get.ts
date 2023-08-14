import RoomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"

type RoomsResponse = {
  id: string
  name: string
  isOpen: boolean
  userIds: Array<string>
}[]

export default defineEventHandler(async () => {
  const repository = new RoomDynamoDBRepository()
  const roomList = await repository.getAll()
  const roomsResponse: RoomsResponse = roomList.map((room) => {
    const userIds = Array.isArray(room.userIds) ? room.userIds.map(userId => userId.value) : []
    return {
      id: room.id.value,
      name: room.name,
      isOpen: room.isOpen,
      userIds: userIds
    }
  })
  
  return roomsResponse
})