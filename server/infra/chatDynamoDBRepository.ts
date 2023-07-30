import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import Chat from '../../domain/Chat'
import IChatRepository from '~/domain/interfaces/IChatRepository'

type ClientConfig = {
  credentials: {
    accessKeyId: string,
    secretAccessKey: string,
  },
  region: string,
  endpoint: string,
}

export default class ChatDynamoDBRepository implements IChatRepository {
  private readonly _client: DynamoDBClient
  private readonly _docClient: DynamoDBDocumentClient
  private readonly _tableName: string

  constructor(clientConfig: ClientConfig) {
    this._client = new DynamoDBClient(clientConfig)
    this._docClient = DynamoDBDocumentClient.from(this._client)
    this._tableName = 'chats'
  }

  // 保存したチャット一覧を取得
  async getAll(): Promise<Array<any>> {
    const command = new ScanCommand({
      TableName: this._tableName
    })

    const response = await this._docClient.send(command)
    if (response.Items) {
      const chatList: Array<any> = response.Items
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