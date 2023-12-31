import userDynamoDBRepository from "~/server/infra/userDynamoDBRepository"
import UserId from "~/domain/User/UserId"
import { QueryObject } from "ufo"

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const userId = new UserId(paramsId)
  const repository = new userDynamoDBRepository()
  await repository.delete(userId)

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
