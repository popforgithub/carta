import { ulid } from 'ulidx'
import UserId from '~/domain/User/UserId'
import RoomId from './RoomId'
import CardSetId from '~/domain/CardSet/CardSetId'
import CardId from '~/domain/Card/CardId'

export default class Room {
  readonly id: RoomId
  name: string
  isOpen: boolean
  cardSetId: CardSetId
  cardSetName: string
  playerIds: Array<UserId>
  audienceIds: Array<UserId>
  shuffledCardIds: Array<CardId>
  matchId: string

  constructor(
    id: string = '',
    name: string = 'no_name',
    isOpen: boolean = true,
    cardSetId: string = '',
    cardSetName: string = '',
    playerIds: Array<string> = [],
    audienceIds: Array<string> = [],
    shuffledCardIds: Array<string> = [],
    matchId?: string
    ) {
    this.id = new RoomId(id)
    this.name = name
    this.isOpen = isOpen
    cardSetId ? this.cardSetId = new CardSetId(cardSetId) : this.cardSetId = { value: '' }
    cardSetName ? this.cardSetName = cardSetName : this.cardSetName = ''
    playerIds ? this.playerIds = playerIds.map(playerId => new UserId(playerId)) : this.playerIds = []
    audienceIds ? this.audienceIds = audienceIds.map(audienceId => new UserId(audienceId)) : this.audienceIds = []
    shuffledCardIds ? this.shuffledCardIds = shuffledCardIds.map(shuffledCardId => new CardId(shuffledCardId)) : this.shuffledCardIds = []
    matchId ? this.matchId = matchId : this.matchId = ulid()
  }
}
