import UserId from "~/domain/User/UserId"
import User from "~/domain/User/User"

export default interface IUserRepository {

  getAll(): Promise<Array<User>>

  findById(id: UserId): Promise<User>

  create(id: UserId): Promise<void>

  update(id: UserId): Promise<void>

  delete(id: UserId): Promise<void>
}