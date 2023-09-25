import scoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"
import ScoreId from "~/domain/Score/ScoreId"
import { QueryObject } from "ufo"
import UserId from "../../../domain/User/UserId"
import CardId from "../../../domain/Card/CardId"
import RoomId from "../../../domain/Room/RoomId"

type PutRequestBody = {
  id: UserId
  cardId: CardId
  roomId: RoomId
  userId: UserId
}

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const paramsCardId: string = JSON.parse(JSON.stringify(params.cardId))
  const paramsRoomId: string = JSON.parse(JSON.stringify(params.roomId))
  const paramsUserId: string = JSON.parse(JSON.stringify(params.userId))
  const scoreId = new ScoreId(paramsId)
  const cardId = new CardId(paramsCardId)
  const roomId = new RoomId(paramsRoomId)
  const userId = new UserId(paramsUserId)
  const repository = new scoreDynamoDBRepository()
  const putRequestBody: PutRequestBody = {
    id: scoreId,
    cardId,
    roomId,
    userId
  }
  await repository.update(putRequestBody)

  event.node.res.statusCode = 200
  event.node.res.statusMessage = "Updated"
  event.node.res.end()
})
