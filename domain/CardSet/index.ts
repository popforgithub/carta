import CardSetId from './CardSetId'

export default class CardSet {
  readonly id: CardSetId
  name: string

  constructor(
    name: string,
    id?: string 
  ) {
    this.name = name
    id ? this.id = new CardSetId(id) : this.id = new CardSetId
  }
}
