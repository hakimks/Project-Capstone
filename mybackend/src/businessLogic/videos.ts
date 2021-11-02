import { VideoItem } from '../models/VideoItem'
import { VideosAccess } from '../dataLayer/videosAccess'
import * as uuid from 'uuid'
import { CreateVideoRequest } from '../requests/CreateVideoRequest'

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