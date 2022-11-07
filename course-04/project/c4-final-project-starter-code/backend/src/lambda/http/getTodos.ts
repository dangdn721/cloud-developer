import 'source-map-support/register'
import { getUserTodos } from '../../helpers/todos';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { headers } from '../utils'
import { createLogger } from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  createLogger('Processing event: '+ event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const result = await getUserTodos(jwtToken)


    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({items :result})
    }
  

}
