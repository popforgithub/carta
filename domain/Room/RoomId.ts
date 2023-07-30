import { ulid } from 'ulidx'

export default class RoomId {
  readonly value: string

  constructor() {
    this.value = ulid()
  }
}
