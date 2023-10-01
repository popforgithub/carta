import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import CardSet from "~/domain/CardSet"
import CardSetId from "~/domain/CardSet/CardSetId"
import ICardSetRepository from '~/domain/interfaces/ICardSetRepository'

const tableName = 'cardSets'
const runtimeConfig = useRuntimeConfig()

export default class CardSetDynamoDBRepository implements ICardSetRepository {
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

  async getAll(): Promise<Array<CardSet>> {
    const command = new ScanCommand({
      TableName: this._tableName
    })

    const response = await this._docClient.send(command)
    if (!response.Items) { return [] }

    const cardSetList = response.Items.map((cardSet) => {
      const id = cardSet.id?.['S'] || ''
      const name = cardSet.name?.['S'] || ''
      return new CardSet(name, id)
    })

    return cardSetList
  }

  async findById(cardSetId: CardSetId): Promise<CardSet> {
    const command = new GetCommand({
      TableName: this._tableName,
      Key: { id: cardSetId.value }
    })
    
    const response = await this._docClient.send(command)
    if (!response.Item) {
      return new CardSet(
        'notFoundById',
        'notFoundById'
      )
    }
    
    return new CardSet(
      response.Item.name,
      response.Item.id
    )
  }

  async create(cardSet: CardSet): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        id: cardSet.id.value,
        name: cardSet.name,
      }
    })
    await this._docClient.send(command)
  }

  async delete(cardSetId: CardSetId): Promise<void> {
    const command = new DeleteCommand({
      TableName: this._tableName,
      Key: { id: cardSetId.value }
    })
    await this._docClient.send(command)
  }

  async update(cardSet: CardSet): Promise<void> {
    const command = new UpdateCommand({
      TableName: this._tableName,
      Key: { id: cardSet.id.value },
      UpdateExpression: "set name = :name",
      ExpressionAttributeValues: {
        ":name": cardSet.name
      },
    })
    await this._docClient.send(command)
  }
}