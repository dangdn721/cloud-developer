import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo, getTodo } from '../../helpers/todos'
import { headers } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Update Logger')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing event: "+event)
    const todoId = event.pathParameters.todoId
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const todoItem = await getTodo(todoId, jwtToken)
    if (!todoItem) {
        return {
            statusCode: 404,
            headers,
            body: ''
        }
    }
    const newData: UpdateTodoRequest = JSON.parse(event.body)
    logger.info("Data Update: "+newData)
    const updatedTodo = await updateTodo(todoItem, newData)

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            updatedTodo
        })
    }
}
