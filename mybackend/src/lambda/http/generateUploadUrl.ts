import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from "@middy/core";
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateVideoThumbnailUrl } from '../../businessLogic/videos'
import { getUserId } from '../utils'
// import { createLogger } from '../../utils/logger'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const bucketName = process.env.THUMBNAIL_S3_BUCKET


const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const handler = middy.default(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const videoId = event.pathParameters.videoId
    const userId = getUserId(event)
    
    const uploadUrl = getUploadUrl(videoId)
    
    const videoWithUrl = {
        thumbnailUrl: `https://${bucketName}.s3.amazonaws.com/${videoId}`
    }

    await updateVideoThumbnailUrl(videoWithUrl, userId, videoId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      })
    }
    
  }
)

function getUploadUrl(videoId: string) {
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: videoId,
    Expires: 300
  })
  console.log("signed url - ", url);
  return url;
  
}

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
