import Chat from "~/domain/Chat"
import chatDynamoDBRepository from "~/server/infra/chatDynamoDBRepository"

type PostRequestBody = {
  content: string
}

export default defineEventHandler(async (event) => {
  const { content }: PostRequestBody = (await readBody(event))
  const chat = new Chat(content)
  const repository = new chatDynamoDBRepository()
  await repository.create(chat)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})