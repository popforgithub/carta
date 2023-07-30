export default class Chat {
  createdAt: number
  content: string

  constructor(
    content: string
  ) {
    this.createdAt = Date.now()
    this.content = content
  }
}