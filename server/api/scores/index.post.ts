import Score from "~/domain/Score"
import scoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"

type PostRequestBody = {
  cardId: string
  roomId: string
  userId: string
}

export default defineEventHandler(async (event) => {
  const { cardId, roomId, userId }: PostRequestBody = (await readBody(event))
  const score = new Score(cardId, roomId, userId)
  const repository = new scoreDynamoDBRepository()
  await repository.create(score)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})