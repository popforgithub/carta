import ScoreId from './ScoreId'
import RoomId from '~/domain/Room/RoomId'
import UserId from '~/domain/User/UserId'

export default class Score {
  readonly id: ScoreId
  roomId: RoomId
  playerId: UserId

  constructor(
    roomId: RoomId,
    playerId: UserId
  ) {
    this.id = new ScoreId
    this.roomId = roomId
    this.playerId = playerId
  }
}
