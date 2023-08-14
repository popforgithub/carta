import UserId from '~/domain/User/UserId'
import RoomId from './RoomId'

export default class Room {
  readonly id: RoomId
  name: string
  isOpen: boolean
  playerIds: Array<UserId>

  constructor(
    id: string = '',
    name: string = 'no_name',
    isOpen: boolean = true,
    playerIds: Array<string> = [],
    ) {
    this.id = new RoomId(id)
    this.name = name
    this.isOpen = isOpen
    playerIds ? this.playerIds = playerIds.map(playerId => new UserId(playerId)) : this.playerIds = []
  }
}
