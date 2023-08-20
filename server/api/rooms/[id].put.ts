import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"
import RoomId from "~/domain/Room/RoomId"
import { QueryObject } from "ufo"
import Room from "../../../domain/Room"
import UserId from "../../../domain/User/UserId"

type PutRequestBody = {
  id: RoomId
  name: string
  isOpen: boolean
  playerIds: Array<UserId>
  audienceIds: Array<UserId>
}

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const paramsIsOpen: boolean = JSON.parse(JSON.stringify(params.isOpen))
  // playerIdが一つだけわたってくるとき何故か配列じゃなくstringになっているので修正が必要
  const paramsPlayerId: Array<string> = JSON.parse(JSON.stringify(params.playerIds))
  const paramsAudienceId: Array<string> = JSON.parse(JSON.stringify(params.audienceIds))
  const roomId = new RoomId(paramsId)
  const repository = new roomDynamoDBRepository()
  const room = await repository.findById(roomId)
  const putRequestBody: PutRequestBody = {
    id: room.id,
    name: room.name,
    isOpen: paramsIsOpen,
    playerIds: paramsPlayerId.map(paramsPlayerId => new UserId(paramsPlayerId)),
    audienceIds: paramsAudienceId.map(paramsAudienceId => new UserId(paramsAudienceId))
  }
  console.log('asdfasdfasf', putRequestBody)
  await repository.update(putRequestBody)

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
