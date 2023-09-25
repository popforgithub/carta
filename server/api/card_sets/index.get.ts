import CardSetDynamoDBRepository from "~/server/infra/cardSetDynamoDBRepository"

type CardSetsResponse = {
  id: string
  name: string
}[]

export default defineEventHandler(async () => {
  const repository = new CardSetDynamoDBRepository()
  const cardSetList = await repository.getAll()
  const cardSetsResponse: CardSetsResponse = cardSetList.map((cardSet) => {
    return {
      id: cardSet.id.value,
      name: cardSet.name
    }
  })

  return cardSetsResponse
})