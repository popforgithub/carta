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
    cardSetId: CardSetId
  ) {
    this.id = new CardId
    this.question = question
    this.answer = answer
    this.cardSetId = cardSetId
  }
}
