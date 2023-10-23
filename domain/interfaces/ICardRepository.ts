import CardId from "~/domain/Card/CardId"
import Card from "~/domain/Card"
import CardSetId from "domain/CardSet/CardSetId"

export default interface ICardRepository {

  getAll(cardSetId: CardSetId): Promise<Array<Card>>

  findById(id: CardId): Promise<Card>

  create(card: Card): Promise<void>

  update(card: Card): Promise<void>

  delete(id: CardId): Promise<void>
}