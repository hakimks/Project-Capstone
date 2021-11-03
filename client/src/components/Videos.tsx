import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Form,
  Button,
  Embed,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createVideo, getVideos } from '../api/videos-api'
import Auth from '../auth/Auth'
import { Video } from '../types/Video'
import { getUploadUrl, uploadFile } from '../api/todos-api'

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



  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/videos/${todoId}/edit`)
  }

  onVideoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    
    
  }

  onVideoDelete = async (todoId: string) => {
    
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
              <Grid.Column width={3} floated="right">
                {video.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {video.videoUrl}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {video.createdAt}
              </Grid.Column>
              {video.thumbnailUrl}
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
