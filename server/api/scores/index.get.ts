import ScoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"

type ScoresResponse = {
  id: string
  cardId: string
  roomId: string
  userId: string
}[]

export default defineEventHandler(async () => {
  const repository = new ScoreDynamoDBRepository()
  const scoreList = await repository.getAll()
  const scoresResponse: ScoresResponse = scoreList.map((score) => {
    return {
      id: score.id.value,
      cardId: score.cardId.value,
      roomId: score.roomId.value,
      userId: score.userId.value
    }
  })
  
  return scoresResponse
})