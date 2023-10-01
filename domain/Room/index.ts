import UserId from '~/domain/User/UserId'
import RoomId from './RoomId'
import CardSetId from '~/domain/CardSet/CardSetId'

export default class Room {
  readonly id: RoomId
  name: string
  isOpen: boolean
  cardSetId: CardSetId
  cardSetName: string
  playerIds: Array<UserId>
  audienceIds: Array<UserId>

  constructor(
    id: string = '',
    name: string = 'no_name',
    isOpen: boolean = true,
    cardSetId: string = '',
    cardSetName: string = '',
    playerIds: Array<string> = [],
    audienceIds: Array<string> = []
    ) {
    this.id = new RoomId(id)
    this.name = name
    this.isOpen = isOpen
    cardSetId ? this.cardSetId = new CardSetId(cardSetId) : this.cardSetId = { value: '' }
    cardSetName ? this.cardSetName = cardSetName : this.cardSetName = ''
    playerIds ? this.playerIds = playerIds.map(playerId => new UserId(playerId)) : this.playerIds = []
    audienceIds ? this.audienceIds = audienceIds.map(audienceId => new UserId(audienceId)) : this.audienceIds = []
  }
}
