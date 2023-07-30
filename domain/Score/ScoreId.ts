import { ulid } from 'ulidx'

export default class ScoreId {
  readonly value: string

  constructor() {
    this.value = ulid()
  }
}
