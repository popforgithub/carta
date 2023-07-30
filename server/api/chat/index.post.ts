import Chat from "~/domain/Chat"
import chatDynamoDBRepository from "~/server/infra/chatDynamoDBRepository"

type PostRequestBody = {
  content: string
}

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig()
  const clientConfig = {
    credentials: {
      accessKeyId: runtimeConfig.accessKeyId,
      secretAccessKey: runtimeConfig.secretAccessKey
    },
    region: runtimeConfig.public.region ? runtimeConfig.public.region : 'us-west-2',
    endpoint: runtimeConfig.public.region ? `dynamodb.${runtimeConfig.public.region}.amazonaws.com` : runtimeConfig.public.dynamodbEndpoint,
  }
  const { content }: PostRequestBody = (await readBody(event))
  const chat = new Chat(content)
  const repository = new chatDynamoDBRepository(clientConfig)
  await repository.create(chat)

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})