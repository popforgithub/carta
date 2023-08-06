import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import User from "~/domain/User"
import UserId from "~/domain/User/UserId"
import IUserRepository from '~/domain/interfaces/IUserRepository'

const tableName = 'users'
const runtimeConfig = useRuntimeConfig()

export default class UserDynamoDBRepository implements IUserRepository {
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
    this._tableName = tableName
  }

  async getAll(): Promise<Array<User>> {
    const command = new ScanCommand({
      TableName: this._tableName
    })

    const response = await this._docClient.send(command)
    if (response.Items) {
      const userList = response.Items.map((user) => {
        if (user.id['S'] && user.name['S']) {
          return new User(
            user.id['S'],
            user.name['S']
          )
        } else {
          throw new Error('userIDかuserNameが空のものgetAllした') 
        }
      })
      return userList
    } else {
      return []
    }
  }

  async create(user: User): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        id: user.id.value,
        name: user.name.value,
      }
    })
    await this._docClient.send(command)
  }

  async delete(userid: UserId): Promise<void> {
    const command = new DeleteCommand({
      TableName: this._tableName,
      Key: {
        id: userid.value
      }
    })
    await this._docClient.send(command)
  }
}