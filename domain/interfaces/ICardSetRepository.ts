import CardSetId from "~/domain/CardSet/CardSetId"
import CardSet from "../CardSet"

export default interface ICardSetRepository {

  getAll(): Promise<Array<CardSet>>

  findById(id: CardSetId): Promise<CardSet>

  create(cardSet: CardSet): Promise<void>

  update(cardSet: CardSet): Promise<void>

  delete(id: CardSetId): Promise<void>
}