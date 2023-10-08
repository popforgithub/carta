import ScoreId from './ScoreId'
import CardId from '~/domain/Card/CardId'
import RoomId from '~/domain/Room/RoomId'
import UserId from '~/domain/User/UserId'

export default class Score {
  readonly id: ScoreId
  cardId: CardId
  roomId: RoomId
  userId: UserId
  userName: string
  matchId: string

  constructor(
    cardId: string,
    roomId: string,
    userId: string,
    userName: string,
    matchId: string,
    id?: string
  ) {
    this.cardId = new CardId(cardId)
    this.roomId = new RoomId(roomId)
    this.userId = new UserId(userId)
    this.userName = userName
    this.matchId = matchId
    id ? this.id = new ScoreId(id) : this.id = new ScoreId
  }
}
