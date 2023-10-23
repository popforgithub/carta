import { ulid } from 'ulidx'

export default class RoomId {
  readonly value: string

  constructor(
    value? : string
  ) {
    value? this.value = value : this.value = ulid()
  }
}
