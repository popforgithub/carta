import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import Score from "~/domain/Score"
import ScoreId from "~/domain/Score/ScoreId"
import IScoreRepository from '~/domain/interfaces/IScoreRepository'

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

  async getAll(matchId: string): Promise<Array<Score>> {
    const command = new QueryCommand({
      TableName: this._tableName,
      IndexName: 'matchIdIndex',
      KeyConditionExpression: "matchId = :matchId",
      ExpressionAttributeValues: {
        ":matchId": { S: matchId }
      },
    })

    const response = await this._docClient.send(command)
    if (!response.Items) { return [] }

    const scoreList = response.Items.map((score) => {
      const id = score.id?.['S'] || ''
      const cardId = score.cardId?.['S'] || ''
      const question = score.question?.['S'] || ''
      const answer = score.answer?.['S'] || ''
      const cardSetId = score.cardSetId?.['S'] || ''
      const cardSetName = score.cardSetName?.['S'] || ''
      const copiedAnswer = score.copiedAnswer?.['S'] || ''
      const roomId = score.roomId?.['S'] || ''
      const userId = score.userId?.['S'] || ''
      const userName = score.userName?.['S'] || ''
      const matchId = score.matchId?.['S'] || ''
      return new Score(cardId, question, answer, cardSetId, cardSetName, copiedAnswer, roomId, userId, userName, matchId, id)
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
    const question: string = response.Item.question
    const answer: string = response.Item.answer
    const cardSetId: string = response.Item.cardSetId
    const cardSetName: string = response.Item.cardSetName
    const copiedAnswer: string = response.Item.copiedAnswer
    const roomId: string = response.Item.roomId
    const userId: string = response.Item.userId
    const userName: string = response.Item.userName
    const matchId: string = response.Item.matchId
    return new Score(id, cardId, question, answer, cardSetId, cardSetName, copiedAnswer, roomId, userId, userName, matchId)
  }

  async create(score: Score): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        id: score.id.value,
        cardId: score.cardId.value,
        question: score.question,
        answer: score.answer,
        cardSetId: score.cardSetId.value,
        cardSetName: score.cardSetName,
        copiedAnswer: score.copiedAnswer,
        roomId: score.roomId.value,
        userId: score.userId.value,
        userName: score.userName,
        matchId: score.matchId
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
      UpdateExpression: "set cardId = :cardId, question = :question, answer = :answer, cardSetId = :cardSetId, cardSetName = :cardSetName, copiedAnswer = :copiedAnswer, roomId = :roomId, userId = :userId, userName = :userName, matchId = :matchId",
      ExpressionAttributeValues: {
        ":cardId": score.cardId.value,
        ":question": score.question,
        ":answer": score.answer,
        ":cardSetId": score.cardSetId.value,
        ":cardSetName": score.cardSetName,
        ":copiedAnswer": score.copiedAnswer,
        ":roomId": score.roomId.value,
        ":userId": score.userId.value,
        ":userName": score.userName,
        ":matchId": score.matchId
      },
    })
    await this._docClient.send(command)
  }
}