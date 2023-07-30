import ScoreId from './ScoreId'
import RoomId from '~/domain/Room/RoomId'
import UserId from '~/domain/User/UserId'

export default class Score {
  readonly id: ScoreId
  roomId: RoomId
  userId: UserId

  constructor(
    roomId: RoomId,
    userId: UserId
  ) {
    this.id = new ScoreId
    this.roomId = roomId
    this.userId = userId
  }
}
