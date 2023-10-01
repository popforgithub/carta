import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb"
import Room from "~/domain/Room"
import RoomId from "~/domain/Room/RoomId"
import IRoomRepository from '~/domain/interfaces/IRoomRepository'

const tableName = 'rooms'
const runtimeConfig = useRuntimeConfig()

export default class RoomDynamoDBRepository implements IRoomRepository {
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

  async getAll(): Promise<Array<Room>> {
    const command = new ScanCommand({
      TableName: this._tableName
    })

    const response = await this._docClient.send(command)
    if (!response.Items) { return [] }

    const roomList = response.Items.map((room) => {
      const id = room.id?.['S']
      const name = room.name?.['S']
      const isOpen = room.isOpen['BOOL']
      const cardSetId = room.cardSetId?.['S']
      const cardSetName = room.cardSetName?.['S']
      const playerIds = room.playerIds?.['L']?.map(playerId => playerId['S'] || '') || []
      const audienceIds = room.audienceIds?.['L']?.map(audienceId => audienceId['S'] || '') || []
      
      const filteredPlayerIds = playerIds.filter(playerId => playerId !== '')
      const filteredAudienceIds = audienceIds.filter(audienceId => audienceId !== '')
      return new Room(id, name, isOpen, cardSetId, cardSetName, filteredPlayerIds, filteredAudienceIds)
    })

    return roomList
  }

  async findById(roomId: RoomId): Promise<Room> {
    const command = new GetCommand({
      TableName: this._tableName,
      Key: { id: roomId.value }
    })
    
    const response = await this._docClient.send(command)
    if (!response.Item) { throw new Error('infraのfindByIdでroomが見つからない') }

    const id: string = response.Item.id
    const name: string = response.Item.name
    const isOpen: boolean = response.Item.isOpen
    const cardSetId: string = response.Item.cardSetId
    const cardSetName: string = response.Item.cardSetName
    const playerIds: Array<string> = response.Item.playerIds
    const audienceIds: Array<string> = response.Item.audienceIds
    return new Room(id, name, isOpen, cardSetId, cardSetName, playerIds, audienceIds)
  }

  async create(room: Room): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        id: room.id.value,
        name: room.name,
        isOpen: true,
        cardSetId: room.cardSetId.value,
        cardSetName: room.cardSetName,
        playerIds: [],
        audienceIds: []
      }
    })
    await this._docClient.send(command)
  }

  async delete(roomId: RoomId): Promise<void> {
    const command = new DeleteCommand({
      TableName: this._tableName,
      Key: { id: roomId.value }
    })
    await this._docClient.send(command)
  }

  async update(room: Room): Promise<void> {
    const command = new UpdateCommand({
      TableName: this._tableName,
      Key: { id: room.id.value },
      UpdateExpression: "set name = :name, isOpen = :isOpen, cardSetId = :cardSetId, cardSetName = :cardSetName, playerIds = :playerIds, audienceIds = :audienceIds",
      ExpressionAttributeValues: {
        ":name": room.name,
        ":isOpen": room.isOpen,
        ":cardSetId": room.cardSetId.value,
        ":cardSetName": room.cardSetName,
        ":playerIds": room.playerIds ? room.playerIds.map(playerId => playerId.value) : [],
        ":audienceIds": room.playerIds ? room.audienceIds.map(audienceId => audienceId.value) : []
      },
    })
    await this._docClient.send(command)
  }
}