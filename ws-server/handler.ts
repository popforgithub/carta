const ws = require("aws-lambda-ws-server");

// 接続IDをメモリに保存
let allConnections: string[] = []
let wsRooms: WsRoom[] = []

exports.websocketApp = ws(
  ws.handler({
    // 接続時に通る
    async connect(event: WebSocketEvent) {
      console.log("connection %s", event.id);
      allConnections.push(event.id)
      return { statusCode: 200 };
    },

    // 切断時に通る
    async disconnect(event: WebSocketEvent) {
      const { postToConnection } = event.context
      console.log("disconnect %s", event.id);
      allConnections = allConnections.filter((id) => id !== event.id )
      for (let i = 0; i < wsRooms.length; i++) {
        if (wsRooms[i].connectionIds.includes(event.id)) {
          wsRooms[i].connectionIds = wsRooms[i].connectionIds.filter((id) => id !== event.id)
          await Promise.all(allConnections.map(async (connection) => {
            await postToConnection({ id: connection, wsConnections: allConnections.length }, connection);
          }))
          return { statusCode: 200 };
        }
      }
    },

    // 未定義の action を指定すると通る
    async default(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection },
      } = event;

      console.log("default message", connectionId, body);

      await postToConnection({ action: "default", echo: body }, connectionId);

      return { statusCode: 200 };
    },

    // "sendMessageToAll" アクションのハンドラ
    async sendMessageToAll(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;

      await Promise.all(allConnections.map(async (connection) => {
        await postToConnection({ echo: body, id: connection, wsConnections: allConnections.length }, connection);
      }))

      return { statusCode: 200 };
    },

    // "makeRoomConnections" アクションのハンドラ
    async makeRoomConnections(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;

      if (!wsRooms.some(wsRoom => wsRoom.roomId === body)) {
        const newRoom: WsRoom = {roomId: body, connectionIds: [connectionId]}
        wsRooms.push(newRoom)
        return { statusCode: 200 };
      } else {
        for (let i = 0; i < wsRooms.length; i++) {
          if (wsRooms[i].roomId === body) {
            wsRooms[i].connectionIds.push(connectionId)
            return { statusCode: 200 };
          }
        }
      }
    },

    // "sendMessageToRoom" アクションのハンドラ
    async sendMessageToRoom(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;

      for (let i = 0; i < wsRooms.length; i++) {
        if (wsRooms[i].roomId === body.id) {
          await Promise.all(wsRooms[i].connectionIds.map(async (connection) => {
            await postToConnection({ matchRoom: body, id: connection }, connection);
          }))
          return { statusCode: 200 };
        }
      }
    },
  })
);


/**
 * aws-lambda-ws-server に型定義がないので書いておく
 */
type WebSocketEvent = {
  id: string;
  event: {
    requestContext: {
      routeKey: string;
      eventType: "CONNECT" | "DISCONNECT" | "MESSAGE";
      connectionId: string;
    };
    multiValueHeaders: { [key: string]: string[] };
    body: string;
  };
  context: {
    postToConnection: (body: any, connectionId: string) => Promise<void>;
  };
  // message は any json だが、このプロジェクトでは常にこの形として定義する
  message: {
    action: string;
    body: any;
  };
};

type WsRoom = {
  roomId: string,
  connectionIds: string[]
}
