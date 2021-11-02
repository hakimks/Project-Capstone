import { apiEndpoint } from '../config'
import { Video} from '../types/Video'
import Axios from 'axios'
import { CreateVideoRequest } from '../types/CreateVideoRequests';

export async function getVideos(idToken: string): Promise<Video[]> {
    console.log('Fetching Videos')
  
    const response = await Axios.get(`${apiEndpoint}/videos`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('Videos from axios:', response.data)
    return response.data.items
  }

  export async function createVideo(
    idToken: string,
    newVideo: CreateVideoRequest
  ): Promise<Video> {
    const response = await Axios.post(`${apiEndpoint}/videos`,  JSON.stringify(newVideo), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    })
    return response.data.item
  }

  export async function getUploadUrl(
    idToken: string,
    videoName: string
  ): Promise<string> {
    const response = await Axios.post(`${apiEndpoint}/todos/${videoName}/attachment`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    })
     console.log('getuploadUrl:', response.data.uploadUrl)
    return response.data.uploadUrl
  }