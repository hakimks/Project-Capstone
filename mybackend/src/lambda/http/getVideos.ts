import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from "@middy/core";
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getVideos } from '../../businessLogic/videos'
import { getUserId } from '../utils'

export const handler = middy.default(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
        const userId = getUserId(event);
        const items = await getVideos(userId);
        console.log("Videos from DyanmoDb - ", items);
        
        return {
            statusCode: 200,
            body: JSON.stringify({items})
        }
    }
)

// export const handler = middy.default(
//     async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>{
//         console.log(event.body);
        
//         return {
//             statusCode: 201,
//             body: JSON.stringify({
//                 message: "Welcome to serverless"
//             })
//         }
//     }
// )


handler
.use(httpErrorHandler())
.use(
    cors({
        credentials: true
    })
)