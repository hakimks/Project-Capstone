# Project: Capstone for Udacity Cloud Nanodegre - serverless design
 Re-using the Serverless-TODO app.


The project is split into two parts:
1. Frontend - 
2. Backend RESTful API - Node-Express application


### 1. Frontend App 

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

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


### 2. Need to implement the backend using AWS Lambda and Serverless framework
* Functions to be implemented
    - Auth
    - 

