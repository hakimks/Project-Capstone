import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from "@middy/core";
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import {UpdatedVideoRequest } from '../../requests/UpdatedVideoRequest'
import { createVideo, updateVideoThumbnailUrl, updateVideo } from '../../businessLogic/videos'

export const handler = middy.default(
    async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
        const videoId = event.pathParameters.videoId 

        const updatedVideo: UpdatedVideoRequest = JSON.parse(event.body)
        const userId = getUserId(event)

        const item = await updateVideo(userId, videoId, updatedVideo)

        return {
            statusCode: 201,
            body: JSON.stringify({
                item
            })
        }

    }
)

handler
.use(httpErrorHandler())
.use(
    cors({
        credentials: true
    })
)