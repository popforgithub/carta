import CardSetId from '~/domain/CardSet/CardSetId'
import CardId from './CardId'

export default class Card {
  readonly id: CardId
  question: string
  answer: string
  cardSetId: CardSetId

  constructor(
    question: string,
    answer: string ,
    cardSetId: string,
    id?: string
  ) {
    this.question = question
    this.answer = answer
    this.cardSetId = new CardSetId(cardSetId)
    id ? this.id = new CardId(id) : this.id = new CardId
  }
}
