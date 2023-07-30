import UserId from './UserId'

export default class User {
  readonly id: UserId
  name: string

  constructor(
    name: string 
  ) {
    this.id = new UserId
    this.name = name
  }
}
