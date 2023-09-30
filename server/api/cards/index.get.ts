import CardDynamoDBRepository from "~/server/infra/cardDynamoDBRepository"
import { QueryObject } from "ufo"
import CardSetId from "../../../domain/CardSet/CardSetId"

type CardsResponse = {
  id: string
  question: string
  answer: string
  cardSetId: string
}[]

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  const paramsCardSetId: string = JSON.parse(JSON.stringify(params.cardSetId))
  const repository = new CardDynamoDBRepository()
  const cardList = await repository.getAll(new CardSetId(paramsCardSetId))
  const cardsResponse: CardsResponse = cardList.map((card) => {
    return {
      id: card.id.value,
      question: card.question,
      answer: card.answer,
      cardSetId: card.cardSetId.value
    }
  })

  return cardsResponse
})