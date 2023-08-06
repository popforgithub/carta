import userDynamoDBRepository from "~/server/infra/userDynamoDBRepository"
import UserId from "~/domain/User/UserId"

type query = {
  id: string
}

export default defineEventHandler(async (event) => {
  const params = await getQuery(event)
  const userId = new UserId(params.id)
  const repository = new userDynamoDBRepository()
  await repository.delete(userId)

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
