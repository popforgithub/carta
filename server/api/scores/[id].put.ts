import scoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"
import ScoreId from "~/domain/Score/ScoreId"
import { QueryObject } from "ufo"
import UserId from "../../../domain/User/UserId"
import CardId from "../../../domain/Card/CardId"
import RoomId from "../../../domain/Room/RoomId"
import CardSetId from "../../../domain/CardSet/CardSetId"

type PutRequestBody = {
  id: UserId
  cardId: CardId
  question: string
  answer: string
  cardSetId: CardSetId
  cardSetName: string
  copiedAnswer: string
  roomId: RoomId
  userId: UserId
  userName: string
  matchId: string
}

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const paramsCardId: string = JSON.parse(JSON.stringify(params.cardId))
  const paramsQuestion: string = JSON.parse(JSON.stringify(params.question))
  const paramsAnswer: string = JSON.parse(JSON.stringify(params.answer))
  const paramsCardSetId: string = JSON.parse(JSON.stringify(params.cardSetId))
  const paramsCardSetName: string = JSON.parse(JSON.stringify(params.cardSetName))
  const paramsCopiedAnswer: string = JSON.parse(JSON.stringify(params.copiedAnswer))
  const paramsRoomId: string = JSON.parse(JSON.stringify(params.roomId))
  const paramsUserId: string = JSON.parse(JSON.stringify(params.userId))
  const paramsUserName: string = JSON.parse(JSON.stringify(params.userName))
  const paramsMatchId: string = JSON.parse(JSON.stringify(params.matchId))
  const scoreId = new ScoreId(paramsId)
  const cardId = new CardId(paramsCardId)
  const cardSetId = new CardSetId(paramsCardSetId)
  const roomId = new RoomId(paramsRoomId)
  const userId = new UserId(paramsUserId)
  const repository = new scoreDynamoDBRepository()
  const putRequestBody: PutRequestBody = {
    id: scoreId,
    cardId,
    question: paramsQuestion,
    answer: paramsAnswer,
    cardSetId,
    cardSetName: paramsCardSetName,
    copiedAnswer: paramsCopiedAnswer,
    roomId,
    userId,
    userName: paramsUserName,
    matchId: paramsMatchId
  }
  await repository.update(putRequestBody)

  event.node.res.statusCode = 200
  event.node.res.statusMessage = "Updated"
  event.node.res.end()
})
