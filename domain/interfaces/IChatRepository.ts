import Chat from "~/domain/Chat"

export default interface IChatRepository {
  // 全てのチャットを取得
  getAll(): Promise<Array<any>>

  create(chat: Chat): Promise<void>
}