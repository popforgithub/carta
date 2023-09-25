import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import Score from "~/domain/Score"
import ScoreId from "~/domain/Score/ScoreId"
import IScoreRepository from '~/domain/interfaces/IScoreRepository'
import RoomId from "../../domain/Room/RoomId"

const tableName = 'scores'
const runtimeConfig = useRuntimeConfig()

export default class ScoreDynamoDBRepository implements IScoreRepository {
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

  async getAll(): Promise<Array<Score>> {
    const command = new ScanCommand({
      TableName: this._tableName
    })

    const response = await this._docClient.send(command)
    if (!response.Items) { return [] }

    const scoreList = response.Items.map((score) => {
      const id = score.id?.['S'] || ''
      const cardId = score.cardId?.['S'] || ''
      const roomId = score.roomId?.['S'] || ''
      const userId = score.userId?.['S'] || ''
      return new Score(cardId, roomId, userId, id)
    })

    return scoreList
  }

  async findById(scoreId: ScoreId): Promise<Score> {
    const command = new GetCommand({
      TableName: this._tableName,
      Key: { id: scoreId.value }
    })
    
    const response = await this._docClient.send(command)
    if (!response.Item) { throw new Error('infraのfindByIdでscoreが見つからない') }

    const id: string = response.Item.id
    const cardId: string = response.Item.cardId
    const roomId: string = response.Item.roomId
    const userId: string = response.Item.userId
    return new Score(id, cardId, roomId, userId)
  }

  async create(score: Score): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        id: score.id.value,
        cardId: score.cardId.value,
        roomId: score.roomId.value,
        userId: score.userId.value
      }
    })
    await this._docClient.send(command)
  }

  async delete(scoreId: ScoreId): Promise<void> {
    const command = new DeleteCommand({
      TableName: this._tableName,
      Key: { id: scoreId.value }
    })
    await this._docClient.send(command)
  }

  async update(score: Score): Promise<void> {
    const command = new UpdateCommand({
      TableName: this._tableName,
      Key: { id: score.id.value },
      UpdateExpression: "set cardId = :cardId, roomId = :roomId, userId = :userId",
      ExpressionAttributeValues: {
        ":cardId": score.cardId.value,
        ":roomId": score.roomId.value,
        ":userId": score.userId.value
      },
    })
    await this._docClient.send(command)
  }
}