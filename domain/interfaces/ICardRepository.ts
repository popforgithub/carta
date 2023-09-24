import CardId from "~/domain/Card/CardId"
import Card from "~/domain/Card"

export default interface ICardRepository {

  getAll(): Promise<Array<Card>>

  findById(id: CardId): Promise<Card>

  create(card: Card): Promise<void>

  update(card: Card): Promise<void>

  delete(id: CardId): Promise<void>
}