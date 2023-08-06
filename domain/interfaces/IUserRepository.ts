import UserId from "~/domain/User/UserId"
import User from "../User"

export default interface IUserRepository {

  getAll(): Promise<Array<User>>

  findById(id: UserId): Promise<User>

  create(user: User): Promise<void>

  update(id: UserId): Promise<void>

  delete(id: UserId): Promise<void>
}