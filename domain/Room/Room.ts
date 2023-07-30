import UserId from '~/domain/User/UserId'
import RoomId from './RoomId'

export default class Room {
  readonly id: RoomId
  userIds: Array<UserId>

  constructor(
    userIds: Array<UserId>
  ) {
    this.id = new RoomId
    this.userIds = userIds
  }
}
