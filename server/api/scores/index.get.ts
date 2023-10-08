import ScoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"
import { QueryObject } from "ufo"

type ScoresResponse = {
  id: string
  cardId: string
  roomId: string
  userId: string
  userName: string
  matchId: string
}[]

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  const paramsMatchId: string = JSON.parse(JSON.stringify(params.matchId))
  const repository = new ScoreDynamoDBRepository()
  const scoreList = await repository.getAll(paramsMatchId)
  const scoresResponse: ScoresResponse = scoreList.map((score) => {
    return {
      id: score.id.value,
      cardId: score.cardId.value,
      roomId: score.roomId.value,
      userId: score.userId.value,
      userName: score.userName,
      matchId: score.matchId
    }
  })

  return scoresResponse
})