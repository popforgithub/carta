import Room from "~/domain/Room"
import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"

export default defineEventHandler(async (event) => {
  const { name, cardSetId, cardSetName, shuffledCardIds } = (await readBody(event))
  const room = new Room('', name, true, cardSetId, cardSetName, [], [], shuffledCardIds)
  const repository = new roomDynamoDBRepository()
  await repository.create(room)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})