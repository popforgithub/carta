import CardSetId from '~/domain/CardSet/CardSetId'
import ScoreId from './ScoreId'
import CardId from '~/domain/Card/CardId'
import RoomId from '~/domain/Room/RoomId'
import UserId from '~/domain/User/UserId'

export default class Score {
  readonly id: ScoreId
  cardId: CardId
  question: string
  answer: string
  cardSetId: CardSetId
  cardSetName: string
  copiedAnswer: string
  roomId: RoomId
  userId: UserId
  userName: string
  matchId: string

  constructor(
    cardId: string,
    question: string,
    answer: string,
    cardSetId: string,
    cardSetName: string,
    copiedAnswer: string,
    roomId: string,
    userId: string,
    userName: string,
    matchId: string,
    id?: string
  ) {
    this.cardId = new CardId(cardId)
    this.question = question
    this.answer = answer
    this.cardSetId = new CardSetId(cardSetId)
    this.cardSetName = cardSetName
    this.copiedAnswer = copiedAnswer
    this.roomId = new RoomId(roomId)
    this.userId = new UserId(userId)
    this.userName = userName
    this.matchId = matchId
    id ? this.id = new ScoreId(id) : this.id = new ScoreId
  }
}
