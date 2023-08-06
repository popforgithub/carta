import User from "~/domain/User"
import userDynamoDBRepository from "~/server/infra/userDynamoDBRepository"

type PostRequestBody = {
  id: string,
  name: string
}

export default defineEventHandler(async (event) => {
  const { id, name }: PostRequestBody = (await readBody(event))
  const user = new User(id, name)
  const repository = new userDynamoDBRepository()
  await repository.create(user)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})