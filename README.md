# Project: Capstone for Udacity Cloud Nanodegre - serverless design
 Re-using the Serverless-TODO app, Develpoed a new serverless backend with typescript. 


The project is split into two parts:
1. Frontend - Reused the Serverless-TODO app front end. Made changed to this to be able to post video links and thumbnails
2. Backend RESTful API - Node-Express application


### 1. Frontend App 

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```
To run a client application first edit the client/src/config.ts file to set correct parameters. And then run the following commands:
 ```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.


### 2. Backend - AWS Lambda and Serverless framework
The serverless is written in typescript and its using serverless-esbuild instead of webpack
# How to run the back end

To deploy an application run the following commands:

```
cd mybackend
npm install
sls deploy --verbose
```

* Functions implemented
    * `Auth` - This implements a custom authorizer for API Gateway that is added to other functions
    * `getVideos` - This gets a list of all the user vidoes from the database

It should return data that looks like this:

```json
{
  "items": [
    {
      "createdAt": "2021-11-03",
      "name": "Learn React by Building an eCommerce Site",
      "thumbnailUrl": "https://udacitycapestone-nameofbucket.s3.amazonaws.com/4403e7d4-2656-4768-bb95-4ef27958a70f",
      "userId": "ggkey|10324864833",
      "videoId": "26f89b9d-3dba-4c3a-9242-c722a87d2fcd",
      "videoUrl": "https://www.youtube.com/watch?v=1DklrGoAxDE",
      "done": true
    },   
  ]
}
```

    * `createVideo` - This function creates a new video and adds it into the database
    * `deleteVideo` - This deletes a single video from the database
    * `generateUploadUrl` - This functions Generates a presigned url and also updates the video thumbnail url link to the s3bucket image file
    * `updateVideo` - This updated the video with done. This is only possible if youe have uploaded a thumbnail of the video first, otherwise it will fail.
