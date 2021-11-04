import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { VideoItem } from '../models/VideoItem'
import {UpdatedVideoRequest } from '../requests/UpdatedVideoRequest'

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

    // update video with url
    async updateVideoThumbnailUrl(videoWithUrl: any): Promise<VideoItem>{
        await this.docClient.update({
            TableName: this.videoTable,
            Key: {
                videoId: videoWithUrl.videoId,
                userId: videoWithUrl.userId,
            }, 
            ExpressionAttributeNames: {"#A": "thumbnailUrl"},
            UpdateExpression: "set #A = :thumbnailUrl",
            ExpressionAttributeValues: {
              ":thumbnailUrl": videoWithUrl.thumbnailUrl,
          },
          ReturnValues: "UPDATED_NEW"
        }).promise()
        return videoWithUrl;
    }

    // Update video with done
    async updateVideo(userId: string, videoId: string, updatedVideo: UpdatedVideoRequest ): Promise<VideoItem>{
        const params = {
            TableName: this.videoTable,
            Key: {
              userId: userId,
              todoId: videoId
            },
            ExpressionAttributeNames: {
              '#video_name': 'name',
            },
            ExpressionAttributeValues: {
              ':name': updatedVideo.name,
              ':thumbnailUrl': updatedVideo.thumbnailUrl,
              ':done': updatedVideo.done,
            },
            UpdateExpression: 'SET #video_name = :name, thumbnailUrl = :thumbnailUrl, done = :done',
            ReturnValues: 'ALL_NEW',
          };

          const results = await this.docClient.update(params).promise();
          console.log("Update of video completed", {results: results});
          
          return results.Attributes as VideoItem;
    }
}
