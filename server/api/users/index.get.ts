import UserDynamoDBRepository from "~/server/infra/userDynamoDBRepository"

type UsersResponse = {
  id: string
  name: string
}[]

export default defineEventHandler(async () => {
  const repository = new UserDynamoDBRepository()
  const userList = await repository.getAll()
  const usersResponse: UsersResponse = userList.map((user) => {
    return {
      id: user.id.value,
      name: user.name.value
    }
  })

  return usersResponse
})