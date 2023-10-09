import Room from "~/domain/Room"
import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"

export default defineEventHandler(async (event) => {
  const { id, name, cardSetId, cardSetName, matchId } = (await readBody(event))
  const room = new Room(id, name, true, cardSetId, cardSetName, [], [], matchId)
  const repository = new roomDynamoDBRepository()
  await repository.create(room)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})