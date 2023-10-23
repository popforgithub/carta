import cardDynamoDBRepository from "~/server/infra/cardDynamoDBRepository"
import CardId from "~/domain/Card/CardId"
import { QueryObject } from "ufo"
import CardSetId from "~/domain/CardSet/CardSetId"

type PutRequestBody = {
  id: CardId
  question: string,
  answer: string,
  cardSetId: CardSetId
}

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const paramsQuestion: string = JSON.parse(params.question)
  const paramsAnswer: string = JSON.parse(params.answer)
  const paramsCardSetId: string = JSON.parse(params.cardSetId)
  const cardId = new CardId(paramsId)
  const cardSetId = new CardSetId(paramsCardSetId)
  const repository = new cardDynamoDBRepository()
  const putRequestBody: PutRequestBody = {
    id: cardId,
    question: params.question,
    answer: params.answer,
    cardSetId: cardSetId
  }
  await repository.update(putRequestBody)

  event.node.res.statusCode = 200
  event.node.res.statusMessage = "Updated"
  event.node.res.end()
})
