import CardSet from "~/domain/CardSet"
import cardSetDynamoDBRepository from "~/server/infra/cardSetDynamoDBRepository"

type PostRequestBody = {
  id: string,
  name: string
}

export default defineEventHandler(async (event) => {
  const { name }: PostRequestBody = (await readBody(event))
  const cardSet = new CardSet(name)
  const repository = new cardSetDynamoDBRepository()
  await repository.create(cardSet)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})