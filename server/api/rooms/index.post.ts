import Room from "~/domain/Room"
import roomDynamoDBRepository from "~/server/infra/roomDynamoDBRepository"

type PostRequestBody = {
  name: string
}

export default defineEventHandler(async (event) => {
  const { name }: PostRequestBody = (await readBody(event))
  const room = new Room('', name)
  console.log('ROOM', room)
  const repository = new roomDynamoDBRepository()
  await repository.create(room)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})