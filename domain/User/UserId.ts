import { ulid } from 'ulidx'

export default class UserId {
  readonly value: string

  constructor(
    value: string
  ) {
    this.value = value
  }
}
