import ChatDynamoDBRepository from "~/server/infra/chatDynamoDBRepository"

type ReturnResponse = {
  content: string
}[]

export default defineEventHandler(async () => {
  const repository = new ChatDynamoDBRepository()
  const chatList = await repository.getAll()
  const returnResponse: ReturnResponse = chatList.map((chat) => {
    return {
    content: chat.content
    }
  })

  return returnResponse
})