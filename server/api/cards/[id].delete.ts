import cardDynamoDBRepository from "~/server/infra/cardDynamoDBRepository"
import CardId from "~/domain/Card/CardId"
import { QueryObject } from "ufo"

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const cardId = new CardId(paramsId)
  const repository = new cardDynamoDBRepository()
  await repository.delete(cardId)

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
