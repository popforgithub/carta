import CardDynamoDBRepository from "~/server/infra/cardDynamoDBRepository"

type CardsResponse = {
  id: string
  question: string
  answer: string
  cardSetId: string
}[]

export default defineEventHandler(async () => {
  const repository = new CardDynamoDBRepository()
  const cardList = await repository.getAll()
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