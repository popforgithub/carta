import { ulid } from 'ulidx'

export default class CardSetId {
  readonly value: string

  constructor() {
    this.value = ulid()
  }
}
