import ScoreId from './ScoreId'
import CardId from '~/domain/Card/CardId'
import RoomId from '~/domain/Room/RoomId'
import UserId from '~/domain/User/UserId'

export default class Score {
  readonly id: ScoreId
  cardId: CardId
  roomId: RoomId
  userId: UserId

  constructor(
    cardId: string,
    roomId: string,
    userId: string,
    id?: string
  ) {
    this.cardId = new CardId(cardId)
    this.roomId = new RoomId(roomId)
    this.userId = new UserId(userId)
    id ? this.id = new ScoreId(id) : this.id = new ScoreId
  }
}
