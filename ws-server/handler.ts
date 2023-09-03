const ws = require("aws-lambda-ws-server");
// 接続IDをメモリに保存
let allConnections: string[] = []
let roomConnections: string[] = []

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
      console.log("disconnect %s", event.id);
      allConnections = allConnections.filter((id) => id !== event.id )
      return { statusCode: 200 };
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
      console.log("connection %s", event.id);
      roomConnections.push(event.id)
      return { statusCode: 200 };
    },

    // "sendMessageToTheRoom" アクションのハンドラ
    async sendMessageToTheRoom(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;

      await Promise.all(roomConnections.map(async (connection) => {
        await postToConnection({ echo: body, id: connection, wsConnections: roomConnections.length }, connection);
      }))

      return { statusCode: 200 };
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