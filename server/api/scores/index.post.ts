import Score from "~/domain/Score"
import scoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"

type PostRequestBody = {
  cardId: string
  roomId: string
  userId: string
  userName: string
  matchId: string
}

export default defineEventHandler(async (event) => {
  const { cardId, roomId, userId, userName, matchId }: PostRequestBody = (await readBody(event))
  const score = new Score(cardId, roomId, userId, userName, matchId)
  const repository = new scoreDynamoDBRepository()
  await repository.create(score)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})