import UserId from '~/domain/User/UserId'
import RoomId from './RoomId'

export default class Room {
  readonly id: RoomId
  name: string
  isOpen: boolean
  playerIds: Array<UserId>
  audienceIds: Array<UserId>

  constructor(
    id: string = '',
    name: string = 'no_name',
    isOpen: boolean = true,
    playerIds: Array<string> = [],
    audienceIds: Array<string> = []
    ) {
    this.id = new RoomId(id)
    this.name = name
    this.isOpen = isOpen
    playerIds ? this.playerIds = playerIds.map(playerId => new UserId(playerId)) : this.playerIds = []
    audienceIds ? this.audienceIds = audienceIds.map(audienceId => new UserId(audienceId)) : this.audienceIds = []
  }
}
