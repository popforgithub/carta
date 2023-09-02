import tableDynamoDBRepository from "~/server/infra/tableDynamoDBRepository"

export default defineEventHandler(async (event) => {
  const repository = new tableDynamoDBRepository()
  await repository.deleteAllTables()

  event.node.res.statusCode = 204
  event.node.res.statusMessage = "Deleted"
  event.node.res.end()
})
