const ws = require("aws-lambda-ws-server");

// 接続IDをメモリに保存
let allConnections: string[] = []
let wsRooms: WsRoom[] = []

exports.websocketApp = ws(
  ws.handler({
    // 接続時に通る
    async connect(event: WebSocketEvent) {
      // const { postToConnection } = event.context
      console.log("connection %s", event.id);
      allConnections.push(event.id)
      // 接続時にヘッダーのカウンターを更新したい
      // await Promise.all(allConnections.map(async (connection) => {
      //   await postToConnection({ id: connection, wsConnections: allConnections.length }, connection);
      // }))
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
          // await Promise.all(allConnections.map(async (connection) => {
          //   await postToConnection({ id: connection, wsConnections: allConnections.length }, connection);
          // }))
          return { statusCode: 200 };
        }
      }
    },

    // // 未定義の action を指定すると通る
    // async default(event: WebSocketEvent) {
    //   const {
    //     id: connectionId,
    //     message: { body },
    //     context: { postToConnection },
    //   } = event;

    //   console.log("default message", connectionId, body);

    //   await postToConnection({ action: "default", echo: body }, connectionId);

    //   return { statusCode: 200 };
    // },

    // "joinRoom" アクションのハンドラ
    async joinRoom(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;
      if (!wsRooms.some(wsRoom => wsRoom.roomId === body.id)) {
        const newRoom: WsRoom = {roomId: body.id, connectionIds: [connectionId]}
        wsRooms.push(newRoom)
      } else {
        for (let i = 0; i < wsRooms.length; i++) {
          if (wsRooms[i].roomId === body.id) {
            wsRooms[i].connectionIds.push(connectionId)
          }
        }
      }
      await Promise.all(allConnections.map(async (connection) => {
        await postToConnection({ echo: body, id: connection }, connection);
      }))
      console.log('join', wsRooms)
      return { statusCode: 200 };
    },

    // "leaveRoom" アクションのハンドラ
    async leaveRoom(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;
      for (let i = 0; i < wsRooms.length; i++) {
        if (wsRooms[i].roomId === body.id) {
          wsRooms[i].connectionIds = wsRooms[i].connectionIds.filter((id) => id !== event.id)
        }
      }
      await Promise.all(allConnections.map(async (connection) => {
        await postToConnection({ echo: body, id: connection }, connection);
      }))
      console.log('leave', wsRooms)
      return { statusCode: 200 };
    },

    // "startMatch" アクションのハンドラ
    async startMatch(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;

      for (let i = 0; i < wsRooms.length; i++) {
        if (wsRooms[i].roomId === body[0]) {
          await Promise.all(wsRooms[i].connectionIds.map(async (connection) => {
            await postToConnection({ matchFlag: true, roomId: body[0], initialNextScoreId: body[1], id: connection }, connection);
          }))
          return { statusCode: 200 };
        }
      }
    },

    // "takeCard" アクションのハンドラ
    async takeCard(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;
      for (let i = 0; i < wsRooms.length; i++) {
        if (wsRooms[i].roomId === body[0].roomId) {
          await Promise.all(wsRooms[i].connectionIds.map(async (connection) => {
            await postToConnection({ score: body[0], nextScoreId: body[1], id: connection }, connection);
          }))
          return { statusCode: 200 };
        }
      }
    },

    // "finishGame" アクションのハンドラ
    async finishGame(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;
      for (let i = 0; i < wsRooms.length; i++) {
        if (wsRooms[i].roomId === body[1]) {
          await Promise.all(wsRooms[i].connectionIds.map(async (connection) => {
            await postToConnection({ finishFlag: true, matchId: body[0], roomId: body[1], id: connection }, connection);
          }))
          wsRooms[i] = null
          wsRooms = wsRooms.filter(room => room !== null)
          return { statusCode: 200 };
        }
      }
    },

    // "reconnectMatch" アクションのハンドラ
    async reconnectMatch(event: WebSocketEvent) {
      const {
        id: connectionId,
        message: { body },
        context: { postToConnection }
      } = event;
      
      for (let i = 0; i < wsRooms.length; i++) {
        if (wsRooms[i].roomId === body) {
          wsRooms[i].connectionIds.push(connectionId)
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
