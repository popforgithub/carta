import UserId from '~/domain/User/UserId'
import RoomId from './RoomId'

export default class Room {
  readonly id: RoomId
  name: string
  isOpen: boolean
  userIds: Array<UserId>

  constructor(
    id: string = '',
    name: string = 'no_name',
    isOpen: boolean = true,
    userIds: Array<string> = [],
    ) {
    this.id = new RoomId(id)
    this.name = name
    this.isOpen = isOpen
    userIds ? this.userIds = userIds.map(userId => new UserId(userId)) : this.userIds = []
  }
}
