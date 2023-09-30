import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import Card from "~/domain/Card"
import CardId from "~/domain/Card/CardId"
import ICardRepository from '~/domain/interfaces/ICardRepository'
import CardSetId from "../../domain/CardSet/CardSetId"

const tableName = 'cards'
const runtimeConfig = useRuntimeConfig()

export default class CardDynamoDBRepository implements ICardRepository {
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

  async getAll(cardSetId: CardSetId): Promise<Array<Card>> {
    const command = new QueryCommand({
      TableName: this._tableName,
      IndexName: 'cardSetIdIndex',
      KeyConditionExpression: "cardSetId = :cardSetId",
      ExpressionAttributeValues: {
        ":cardSetId": { S: cardSetId.value }
      },
    })

    const response = await this._docClient.send(command)
    if (!response.Items) { return [] }

    const cardList = response.Items.map((card) => {

      const id = card.id?.['S'] || ''
      const question = card.question?.['S'] || ''
      const answer = card.answer?.['S'] || ''
      const cardSetId = card.cardSetId?.['S'] || ''
      return new Card(question, answer, cardSetId, id)
    })

    return cardList
  }

  async findById(cardId: CardId): Promise<Card> {
    const command = new GetCommand({
      TableName: this._tableName,
      Key: { id: cardId.value }
    })
    
    const response = await this._docClient.send(command)
    if (!response.Item) {
      return new Card(
        'notFoundById',
        'notFoundById',
        'notFoundById'
      )
    }
    
    return new Card(
      response.Item.id,
      response.Item.question,
      response.Item.answer,
      response.Item.cardSetId
    )
  }

  async create(card: Card): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        id: card.id.value,
        question: card.question,
        answer: card.answer,
        cardSetId: card.cardSetId.value
      }
    })
    await this._docClient.send(command)
  }

  async delete(cardId: CardId): Promise<void> {
    const command = new DeleteCommand({
      TableName: this._tableName,
      Key: { id: cardId.value }
    })
    await this._docClient.send(command)
  }

  async update(card: Card): Promise<void> {
    const command = new UpdateCommand({
      TableName: this._tableName,
      Key: { id: card.id.value },
      UpdateExpression: "set question = :question, answer = :answer",
      ExpressionAttributeValues: {
        ":question": card.question,
        ":answer": card.answer,
      },
    })
    await this._docClient.send(command)
  }
}