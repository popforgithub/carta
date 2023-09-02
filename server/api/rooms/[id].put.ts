import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"
import RoomId from "~/domain/Room/RoomId"
import { QueryObject } from "ufo"
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
  const paramsIsOpen: boolean = JSON.parse(params.isOpen)
  // playerIdが一つだけわたってくるとき何故か配列じゃなくstringになっているので修正が必要
  const rawParamsPlayerIds: Array<string> = Array.isArray(params.playerIds) ? params.playerIds : [params.playerIds]
  const rawParamsAudienceIds: Array<string> = Array.isArray(params.audienceIds) ? params.audienceIds : [params.audienceIds]
  const paramsPlayerIds: Array<string> = JSON.parse(JSON.stringify(rawParamsPlayerIds))
  const paramsAudienceIds: Array<string> = JSON.parse(JSON.stringify(rawParamsAudienceIds))
  const roomId = new RoomId(paramsId)
  const repository = new roomDynamoDBRepository()
  const room = await repository.findById(roomId)
  const putRequestBody: PutRequestBody = {
    id: room.id,
    name: room.name,
    isOpen: paramsIsOpen,
    playerIds: paramsPlayerIds ? paramsPlayerIds.map(paramsPlayerId => new UserId(paramsPlayerId)) : [],
    audienceIds: paramsAudienceIds ? paramsAudienceIds.map(paramsAudienceId => new UserId(paramsAudienceId)) : []
  }
  await repository.update(putRequestBody)

  event.node.res.statusCode = 200
  event.node.res.statusMessage = "Updated"
  event.node.res.end()
})
