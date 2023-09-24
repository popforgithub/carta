import RoomId from "~/domain/Room/RoomId"
import Room from "~/domain/Room"

export default interface IRoomRepository {

  getAll(): Promise<Array<Room>>

  findById(id: RoomId): Promise<Room>

  create(room: Room): Promise<void>

  update(room: Room): Promise<void>

  delete(id: RoomId): Promise<void>
}