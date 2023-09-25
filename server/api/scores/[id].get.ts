import scoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"
import ScoreId from "~/domain/Score/ScoreId"

type ScoreResponse = {
  id: string
  cardId: string
  roomId: string
  userId: string
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
    roomId: score.roomId.value,
    userId: score.userId.value
  }
  return scoreResponse
})