import ChatDynamoDBRepository from "~/server/infra/chatDynamoDBRepository"

type ReturnResponse = {
  content: string
}[]

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  const clientConfig = {
    credentials: {
      accessKeyId: runtimeConfig.accessKeyId,
      secretAccessKey: runtimeConfig.secretAccessKey
    },
    region: runtimeConfig.public.region ? runtimeConfig.public.region : 'us-west-2',
    endpoint: runtimeConfig.public.region ? `dynamodb.${runtimeConfig.public.region}.amazonaws.com` : runtimeConfig.public.dynamodbEndpoint,
  }

  const repository = new ChatDynamoDBRepository(clientConfig)
  const chatList = await repository.getAll()
  const returnResponse: ReturnResponse = chatList.map((chat) => {
    return {
    content: chat.content['S']
    }
  })

  return returnResponse
})