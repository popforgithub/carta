import cardSetDynamoDBRepository from "~/server/infra/cardSetDynamoDBRepository"
import CardSetId from "~/domain/CardSet/CardSetId"
import { QueryObject } from "ufo"

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const cardSetId = new CardSetId(paramsId)
  const repository = new cardSetDynamoDBRepository()
  await repository.delete(cardSetId)

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
