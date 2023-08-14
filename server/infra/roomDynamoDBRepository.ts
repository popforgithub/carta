import { AttributeValue, DynamoDBClient, ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
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
    if (!response.Items) {
      return []
    }

    const roomList = response.Items.map((room) => {
      const id = room.id?.['S']
      const name = room.name?.['S']
      const isOpen = room.isOpen?.['BOOL']
      const userIds = room.userIds?.['L']?.map(userId => userId['S'] || '') || []
      return new Room(id, name, isOpen, userIds)
    })
    
    return roomList
  }
  // async getAll(): Promise<Array<Room>> {
  //   const command = new ScanCommand({
  //     TableName: this._tableName
  //   });
  
  //   const response = await this._docClient.send(command);
  
  //   return this.parseResponse(response);
  // }
  
  // private parseResponse(response: ScanCommandOutput): Array<Room> {
  //   if (!response.Items) {
  //     return [];
  //   }
  
  //   return response.Items.map((room) => {
  //     const userIds = this.extractUserIds(room);
  //     return new Room(
  //       room.id['S'],
  //       room.name['S'],
  //       room.isOpen['BOOL'],
  //       userIds
  //     );
  //   });
  // }
  
  // private extractUserIds(room: { [key: string]: AttributeValue }): string[] {
  //   const userIdsAttribute = room.userIds['L'];
  //   if (!userIdsAttribute) {
  //     return [];
  //   }
  
  //   return userIdsAttribute.map((userId) => userId['S'] || '');
  // }
  
  async findById(roomId: RoomId): Promise<Room> {
    const command = new GetCommand({
      TableName: this._tableName,
      Key: {
        id: roomId.value
      }
    })
    
    const response = await this._docClient.send(command)
    if (response.Item) {
      return new Room(
        response.Item.id,
        response.Item.name
      )
    } else {
      return new Room(
        'undefined',
        'undefined'
      )
    }
  }

  async create(room: Room): Promise<void> {
    const command = new PutCommand({
      TableName: this._tableName,
      Item: {
        id: room.id.value,
        name: room.name.value,
      }
    })
    await this._docClient.send(command)
  }

  async delete(roomId: RoomId): Promise<void> {
    const command = new DeleteCommand({
      TableName: this._tableName,
      Key: {
        id: roomId.value
      }
    })
    await this._docClient.send(command)
  }
}