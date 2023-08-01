import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import Chat from '../../domain/Chat'
import IChatRepository from '~/domain/interfaces/IChatRepository'

const runtimeConfig = useRuntimeConfig()

export default class ChatDynamoDBRepository implements IChatRepository {
  private readonly _client: DynamoDBClient
  private readonly _docClient: DynamoDBDocumentClient
  private readonly _tableName: string

  constructor(accessKeyId?: string, secretAccessKey?: string, region?: string) {
    const clientConfig = {
      credentials: {
        accessKeyId: runtimeConfig.accessKeyId ? runtimeConfig.accessKeyId : "dummy_id",
        secretAccessKey: runtimeConfig.secretAccessKey ? runtimeConfig.secretAccessKey : "dummy_access_key"
      },
      region: runtimeConfig.public.region ? runtimeConfig.public.region : 'us-west-2',
      endpoint: runtimeConfig.public.region ? `dynamodb.${runtimeConfig.public.region}.amazonaws.com` : runtimeConfig.public.dynamodbEndpoint,
    }

    this._client = new DynamoDBClient(clientConfig)
    this._docClient = DynamoDBDocumentClient.from(this._client)
    this._tableName = 'chats'
  }

  // 保存したチャット一覧を取得
  async getAll(): Promise<Array<Chat>> {
    const command = new ScanCommand({
      TableName: this._tableName
    })

    const response = await this._docClient.send(command)
    const items = response.Items
    if (items) {
      const chatList: Array<Chat> = items.map((chat) => {
        return {
          createdAt: chat.createdAt['S'],
          content: chat.content['S']
        }
      })
      return chatList
    } else {
      return []
    }
  }

  // 保存
  async create(chat: Chat): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        createdAt: chat.createdAt,
        content: chat.content,
      }
    })
    await this._docClient.send(command)
  }
}