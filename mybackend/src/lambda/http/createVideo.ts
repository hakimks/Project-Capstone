import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from "@middy/core";
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import {CreateVideoRequest } from '../../requests/CreateVideoRequest'
import { createVideo } from '../../businessLogic/videos'

export const handler = middy.default(
    async(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
        const newVideoRequest: CreateVideoRequest = JSON.parse(event.body) 

        const userId = getUserId(event)
        const newVideo = await createVideo(userId, newVideoRequest)

        return {
            statusCode: 201,
            body: JSON.stringify({
                item: newVideo
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