import RoomId from "~/domain/Room/RoomId"
import Room from "~/domain/Room"
import UserId from "~/domain/User/UserId"

export default interface IRoomRepository {

  getAll(): Promise<Array<Room>>

  findById(id: RoomId): Promise<Room>

  create(room: Room): Promise<void>

  update(id: RoomId, userId: UserId): Promise<void>

  delete(id: RoomId): Promise<void>
}