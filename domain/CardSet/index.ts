import CardSetId from './CardSetId'

export default class CardSet {
  readonly id: CardSetId
  name: string

  constructor(
    name: string 
  ) {
    this.id = new CardSetId
    this.name = name
  }
}
