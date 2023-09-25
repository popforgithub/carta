import cardSetDynamoDBRepository from "~/server/infra/cardSetDynamoDBRepository"
import CardSetId from "~/domain/CardSet/CardSetId"

type CardSetResponse = {
  id: string,
  name: string
}

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const cardSetId = new CardSetId(paramsId)
  const repository = new cardSetDynamoDBRepository()
  const cardSet = await repository.findById(cardSetId)
  const cardSetResponse: CardSetResponse = {
    id: cardSet.id.value,
    name: cardSet.name
  }
  return cardSetResponse
})