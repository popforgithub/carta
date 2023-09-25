import cardSetDynamoDBRepository from "~/server/infra/cardSetDynamoDBRepository"
import CardSetId from "~/domain/CardSet/CardSetId"
import { QueryObject } from "ufo"

type PutRequestBody = {
  id: CardSetId
  name: string
}

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const paramsName: string = JSON.parse(params.name)
  const cardSetId = new CardSetId(paramsId)
  const repository = new cardSetDynamoDBRepository()
  const putRequestBody: PutRequestBody = {
    id: cardSetId,
    name: paramsName
  }
  await repository.update(putRequestBody)

  event.node.res.statusCode = 200
  event.node.res.statusMessage = "Updated"
  event.node.res.end()
})
