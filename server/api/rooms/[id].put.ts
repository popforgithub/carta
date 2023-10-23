import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"
import RoomId from "~/domain/Room/RoomId"
import { QueryObject } from "ufo"
import UserId from "../../../domain/User/UserId"
import CardSetId from "../../../domain/CardSet/CardSetId"
import Room from "../../../domain/Room"

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const paramsName: string = JSON.parse(JSON.stringify(params.name))
  const paramsIsOpen: boolean = JSON.parse(params.isOpen)
  const paramsCardSetId: string = JSON.parse(JSON.stringify(params.cardSetId))
  const paramsCardSetName: string = JSON.parse(JSON.stringify(params.cardSetName))
  // playerIdが一つだけわたってくるとき何故か配列じゃなくstringになっているので修正が必要
  const rawParamsPlayerIds: Array<string> = Array.isArray(params.playerIds) ? params.playerIds : [params.playerIds]
  const rawParamsAudienceIds: Array<string> = Array.isArray(params.audienceIds) ? params.audienceIds : [params.audienceIds]
  const paramsPlayerIds: Array<string> = JSON.parse(JSON.stringify(rawParamsPlayerIds))
  const paramsAudienceIds: Array<string> = JSON.parse(JSON.stringify(rawParamsAudienceIds))
  const paramsMatchId: string = JSON.parse(JSON.stringify(params.matchId))

  const repository = new roomDynamoDBRepository()
  const room: Room = {
    id: new RoomId(paramsId),
    name: paramsName,
    isOpen: paramsIsOpen,
    cardSetId: new CardSetId(paramsCardSetId),
    cardSetName: paramsCardSetName,
    playerIds: paramsPlayerIds ? paramsPlayerIds.map(paramsPlayerId => new UserId(paramsPlayerId)) : [],
    audienceIds: paramsAudienceIds ? paramsAudienceIds.map(paramsAudienceId => new UserId(paramsAudienceId)) : [],
    matchId: paramsMatchId
  }
  await repository.update(room)

  event.node.res.statusCode = 200
  event.node.res.statusMessage = "Updated"
  event.node.res.end()
})
