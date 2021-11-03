import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { VideoItem } from '../models/VideoItem'

export class VideosAccess{
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'}),
        private readonly videoTable = process.env.VIDEOS_TABLE,
        // private readonly indexName = process.env.VIDEOS_TABLE_INDEX
    ){}

    // Get all vidoes for the user
    async getAllVideos(userId: string): Promise<VideoItem[]>{
        console.log("Getting videos for " , userId);

        const results = await this.docClient.query({
            TableName: this.videoTable,
            // IndexName: this.indexName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = results.Items

        return items as VideoItem[]
        
    }

    // Create a new Video
    async createNewVideo(videoItem: VideoItem): Promise<VideoItem>{
        await this.docClient.put({
            TableName: this.videoTable,
            Item: videoItem
        }).promise()
        
        return videoItem;
    }

    // Delete a video
    async deleteVideo(userId: string, videoId:String){
        const params = {
            TableName: this.videoTable,
            Key: {
                userId,
                videoId
            }
        }
        await this.docClient.delete(params, function(err, data){
            if (err) {
                console.error("Unable to delete Video", JSON.stringify(err))
            } else {
                console.log("Video deleted successfully!", JSON.stringify(data))
            }
        }).promise()
        return null
    }
}
