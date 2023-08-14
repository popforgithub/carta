import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"
import RoomId from "~/domain/Room/RoomId"
import { QueryObject } from "ufo"

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const roomId = new RoomId(paramsId)
  const repository = new roomDynamoDBRepository()
  await repository.delete(roomId)

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
