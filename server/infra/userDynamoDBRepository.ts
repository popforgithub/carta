import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import IUserRepository from '~/domain/interfaces/IUserRepository'
import UserId from "~/domain/User/UserId"
import User from "../../domain/User/User"

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
        if (user.id['S']) {
          return new User(
            new UserId(user.id['S']),
            user.name['S']
          )
        } else {
          return new User(
            new UserId('undefined'),
            user.name['S'])
        }
      })
      return userList
    } else {
      return []
    }
  }

  // async create(id: UserId): Promise<void> {
  //   const command = new PutCommand({
  //     TableName: this._tableName,
  //     Item: {
  //       createdAt: user.createdAt,
  //       content: user.content,
  //     }
  //   })
  //   await this._docClient.send(command)
  // }
}