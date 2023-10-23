import scoreDynamoDBRepository from "~/server/infra/scoreDynamoDBRepository"
import ScoreId from "~/domain/Score/ScoreId"
import { QueryObject } from "ufo"

export default defineEventHandler(async (event) => {
  const params: QueryObject = getQuery(event)
  // QueryObjectをstringに変換
  const paramsId: string = JSON.parse(JSON.stringify(params.id))
  const scoreId = new ScoreId(paramsId)
  const repository = new scoreDynamoDBRepository()
  await repository.delete(scoreId)

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
