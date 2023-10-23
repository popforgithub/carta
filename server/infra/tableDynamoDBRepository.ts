import { DynamoDBClient, CreateTableCommand, DeleteTableCommand } from "@aws-sdk/client-dynamodb"

const runtimeConfig = useRuntimeConfig()

export default class tableDynamoDBRepository {
  private readonly _client: DynamoDBClient
  private readonly _tableList: Array<string>

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
    this._tableList = ['users', 'rooms']
  }

  async createAllTables() {
    for (const table of this._tableList) {
      const command = new CreateTableCommand({
        TableName: table,
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
      })
      await this._client.send(command)
    }
  }

  async deleteAllTables() {
    for (const table of this._tableList) {
      const command = new DeleteTableCommand({
        TableName: table,
      })
      await this._client.send(command)
    }
  }
}