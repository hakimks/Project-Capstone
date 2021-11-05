import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Form,
  Button,
  Embed,
  Divider,
  Grid,
  Header,
  Checkbox,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createVideo, getVideos, deleteVideo } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'
import { getUploadUrl, uploadFile, patchVideo } from '../api/videos-api'

interface VideosProps {
  auth: Auth
  history: History
}

interface VideosState {
  videos: Video[]
  name: string
  createdAt: string
  videoUrl: string
  thumbnailUrl: string
  loadingVideos: boolean
  file: any
  uploadState: UploadState
}

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

export class Videos extends React.PureComponent<VideosProps, VideosState> {
  state: VideosState = {
    videos: [],
    name: '',
    createdAt: '',
    videoUrl: '',
    thumbnailUrl: '',
    loadingVideos: true,
    file: undefined,
    uploadState: UploadState.NoUpload
  }



  onEditButtonClick = (videoId: string) => {
    this.props.history.push(`/videos/${videoId}/edit`)
  }


  onVideoDelete = async (videoId: string) => {
    try {
      await deleteVideo(this.props.auth.getIdToken(), videoId)
      this.setState({
        videos: this.state.videos.filter(video => video.videoId !== videoId)
      })
    } catch {
      alert('Video deletion failed')
    }
  }

  onVideoCheck = async (pos: number) => {
    try {
      const video = this.state.videos[pos]
      const res = await patchVideo(this.props.auth.getIdToken(), video.videoId, {
        name: video.name,
        thumbnailUrl: video.thumbnailUrl,
        done: !video.done
      })
      if(res){
        this.setState({
          videos: update(this.state.videos, {
            [pos]: { done: { $set: !video.done } }
          })
        })
      }
      
    } catch {
      alert('Video checking failed, Make sure you have uploaded a thumbnail frist')
      
    }
  }



  async componentDidMount() {
    try {
      const videos = await getVideos(this.props.auth.getIdToken())
      console.log("video Items - ", videos);
      
      this.setState({
        videos,
        loadingVideos: false
      })
      
    } catch (e) {
      if(e instanceof Error){
        alert(`Failed to fetch Videos: ${e.message}`)
      }
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Videos</Header>

        {this.renderCreateVideoInput()}

        <Header as="h3">List of User Videos</Header>

        {this.renderVideosList()}
      </div>
    )
  }

  renderCreateVideoInput() {
    const { name, videoUrl } = this.state
    return (
      <div>
        <h1>Create new Video</h1>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Input
                label="Video Name"
                placeholder='Name of Video'
                name='name'
                value={name}
                onChange={this.handleChange1}
              />
              <Form.Input
                label="Video URL"
                placeholder='Video Url'
                name='videoUrl'
                value={videoUrl}
                onChange={this.handleChange2}
              />
              <Form.Button content='Submit' />
            </Form.Group>
          </Form>
      </div>
    )
  }

  handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) =>{
    this.setState({
      name: event.target.value
    })
      console.log( event.target.value);
      
  }

  handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) =>{
    this.setState({
      videoUrl: event.target.value
    })
      console.log( event.target.value);
      
  }


  renderVideosList() {
    if (this.state.loadingVideos) {
      return this.renderLoading()
    }

    return this.renderVideoList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Videos
        </Loader>
      </Grid.Row>
    )
  }

  renderVideoList() {
    return (
      <Grid padded>
        {this.state.videos.map((video, pos) => {
          return (
            <Grid.Row key={video.videoId}>
              <Grid.Column width={1} floated="right">
                <Checkbox
                  className="checkbox"
                  onChange={() => this.onVideoCheck(pos)}
                  checked={video.done}
                />
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {video.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {video.videoUrl}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {video.createdAt}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
              
              {video.thumbnailUrl && (
                <Image src={video.thumbnailUrl} size="small" wrapped />
              )}
              </Grid.Column>
              
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(video.videoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onVideoDelete(video.videoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
              
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDate(): string {
    const date = new Date()

    return dateFormat(date, 'yyyy-mm-dd') as string
  }


  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
      if (this.state.name === '' || this.state.videoUrl === '') {
        alert('Please enter the vide name and url')
        return
      }
      
      try {
        const createdAtDate = this.calculateDate()
        this.setState({
          createdAt:createdAtDate
        })
        const newVideo = await createVideo(this.props.auth.getIdToken(), {
          name: this.state.name,
          createdAt: createdAtDate,
          videoUrl: this.state.videoUrl
        })
        this.setState({
          videos: [...this.state.videos, newVideo],
          name: '',
          createdAt: '',
          videoUrl: ''
        })
      } catch {
        alert('Video creation failed')
      }
      
      
    
  }

  
}
