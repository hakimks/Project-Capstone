import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from "@middy/core";
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteVideo } from '../../businessLogic/videos'
import { getUserId } from '../utils'

export const handler = middy.default(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
        const videoId = event.pathParameters.videoId;
        const userId = getUserId(event)

        await deleteVideo(userId, videoId)
        const item = null;
        return {
            statusCode: 200,
            body: JSON.stringify({item})
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