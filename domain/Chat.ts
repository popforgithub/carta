import { ulid } from 'ulidx'

export default class Chat {
  createdAt: string
  content: string
  
  constructor(
    content: string
  ) {
    this.createdAt = ulid()
    this.content = content
  }
}