import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo, getTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Update Logger')

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.TODO_IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const todoItem = await getTodo(todoId, jwtToken)
  if (!todoItem) {
      return {
          statusCode: 404,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
          },
          body: ''
      }
  }

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedUrl = await getUploadUrl(todoId)

  const newData: UpdateTodoRequest = {
    ...todoItem,
    attachmentUrl: signedUrl,
  }
  const updatedTodo = await updateTodo(todoItem, newData)
  
  logger.info({
    updatedTodo
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        uploadUrl:signedUrl
    })
  }

}


function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: parseInt(urlExpiration)
    })
  }