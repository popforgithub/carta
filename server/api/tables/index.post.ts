import tableDynamoDBRepository from "~/server/infra/tableDynamoDBRepository"

export default defineEventHandler(async (event) => {
  const repository = new tableDynamoDBRepository()
  await repository.createAllTables()

  event.node.res.statusCode = 201
  event.node.res.statusMessage = "Created"
  event.node.res.end()
})