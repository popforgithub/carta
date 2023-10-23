import cardDynamoDBRepository from "~/server/infra/cardDynamoDBRepository"
import CardId from "~/domain/Card/CardId"

type CardResponse = {
  id: string
  question: string
  answer: string
  cardSetId: string
}

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const cardId = new CardId(paramsId)
  const repository = new cardDynamoDBRepository()
  const card = await repository.findById(cardId)
  const cardResponse: CardResponse = {
    id: card.id.value,
    question: card.question,
    answer: card.answer,
    cardSetId: card.cardSetId.value
  }
  return cardResponse
})