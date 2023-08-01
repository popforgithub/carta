import UserId from '~/domain/User/UserId'
import RoomId from './RoomId'

export default class Room {
  readonly id: RoomId
  name: string
  userIds: Array<UserId>
  isOpen: boolean

  constructor(
    name: string
  ) {
    this.id = new RoomId
    this.name = name
    this.userIds = []
    this.isOpen = true
  }
}
