import UserId from './UserId'
import UserName from './UserName'

export default class User {
  readonly id: UserId
  name: UserName

  constructor(
    id: string,
    name : string
  ) {
    this.id = new UserId(id)
    this.name = new UserName(name)
  }
}
