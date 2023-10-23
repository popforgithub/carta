import Card from "~/domain/Card"
import cardDynamoDBRepository from "~/server/infra/cardDynamoDBRepository"

type PostRequestBody = {
  question: string
  answer: string
  cardSetId: string
}

export default defineEventHandler(async (event) => {
  const { question, answer, cardSetId }: PostRequestBody = (await readBody(event))
  const card = new Card(question, answer, cardSetId)
  const repository = new cardDynamoDBRepository()
  await repository.create(card)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})