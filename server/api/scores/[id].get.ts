import scoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"
import ScoreId from "~/domain/Score/ScoreId"

type ScoreResponse = {
  id: string
  cardId: string
  question: string
  answer: string
  cardSetId: string
  cardSetName: string
  copiedAnswer: string
  roomId: string
  userId: string
  userName: string
  matchId: string
}

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const scoreId = new ScoreId(paramsId)
  const repository = new scoreDynamoDBRepository()
  const score = await repository.findById(scoreId)
  const scoreResponse: ScoreResponse = {
    id: score.id.value,
    cardId: score.cardId.value,
    question: score.question,
    answer: score.answer,
    cardSetId: score.cardSetId.value,
    cardSetName: score.cardSetName,
    copiedAnswer: score.copiedAnswer,
    roomId: score.roomId.value,
    userId: score.userId.value,
    userName: score.userName,
    matchId: score.matchId
  }
  return scoreResponse
})