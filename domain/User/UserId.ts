import { ulid } from 'ulidx'

export default class UserId {
  readonly value: string

  constructor() {
    this.value = ulid()
  }
}
