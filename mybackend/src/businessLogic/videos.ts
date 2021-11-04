import { VideoItem } from '../models/VideoItem'
import { VideosAccess } from '../dataLayer/videosAccess'
import * as uuid from 'uuid'
import { CreateVideoRequest } from '../requests/CreateVideoRequest'
import {UpdatedVideoRequest } from '../requests/UpdatedVideoRequest'

const videosAccess = new VideosAccess()

export async function getVideos(userId: string,): Promise<VideoItem[]> {
    return videosAccess.getAllVideos(userId)
    
}

export async function createVideo(userId: string, createVideoRequest: CreateVideoRequest): Promise<VideoItem> {
    const videoId = uuid.v4()

    return videosAccess.createNewVideo({
        userId,
        videoId,
        name: createVideoRequest.name,
        createdAt: createVideoRequest.createdAt,
        videoUrl: createVideoRequest.videoUrl
    })
}

export async function deleteVideo(userId:string, videoId: string) {
    return videosAccess.deleteVideo(userId, videoId)
}


export async function updateVideoThumbnailUrl(videoWithUrl, userId:string, videoId: string) {
    return await videosAccess.updateVideoThumbnailUrl({
        userId,
        videoId, 
        thumbnailUrl: videoWithUrl.thumbnailUrl
    })
    
}

export async function updateVideo(userId:string, videoId: string, updatedVideoRequest: UpdatedVideoRequest ) {
    return await videosAccess.updateVideo(userId, videoId, updatedVideoRequest)
}
