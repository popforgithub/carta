import { ulid } from 'ulidx'

export default class CardId {
  readonly value: string

  constructor() {
    this.value = ulid()
  }
}
