import { v4 as uuidv4 } from 'uuid'

export default class ScoreId {
  readonly value: string

  constructor(
    value? : string
  ) {
    value? this.value = value : this.value = uuidv4()
  }
}
