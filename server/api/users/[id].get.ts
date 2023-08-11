import userDynamoDBRepository from "~/server/infra/userDynamoDBRepository"
import UserId from "~/domain/User/UserId"

type UserResponse = {
  id: string,
  name: string
}

export default defineEventHandler(async (event) => {
  const params = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const userId = new UserId(paramsId)
  const repository = new userDynamoDBRepository()
  const user = await repository.findById(userId)
  const userResponse: UserResponse = {
    id: user.id.value,
    name: user.name.value
  }
  return userResponse
})