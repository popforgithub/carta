import UserId from './UserId'

export default class User {
  readonly id: UserId
  name: string

  constructor(
    id: UserId,
    name?: string 
  ) {
    this.id = id
    this.name = name ? name : 'NoName'
  }
}
