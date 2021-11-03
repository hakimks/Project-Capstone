import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'udacity-capestone',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: "dev",
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      VIDEOS_TABLE: "Videos-${self:provider.stage}",
      VIDEOS_TABLE_INDEX: "VideoCreatedAtIndex"
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        Resource: "*",

      }
    ]
  },
  // import the function via paths
  functions: { 
    Auth: {
      handler: 'src/lambda/auth/authorizer.handler'

    },
    getVideos: {
      handler: 'src/lambda/http/getVideos.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'videos',
            cors: true,
            authorizer: {
              name: "Auth"
            }
          },
        },
      ],
    },
    createVideo: {
      handler: 'src/lambda/http/createVideo.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'videos',
            cors: true,
            authorizer: {
              name: "Auth"
            },
            request: {
              schemas: {
                'application/json': '${file(src/schema/create-video-schema.json)}'
              }
            }
          },
        },
      ],
    },
    deleteVideo: {
      handler: 'src/lambda/http/deleteVideo.handler',
      events: [
        {
          http: {
            method: 'delete',
            path: 'videos/{videoId}',
            cors: true,
            authorizer: {
              name: "Auth"
            },
          },
        },
      ],
    }
   },
   resources: {
     Resources: {
      VideosTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'userId',
              AttributeType: 'S'
            },
            {
              AttributeName: 'videoId',
              AttributeType: 'S'
            },
            
          ],
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'videoId',
              KeyType: 'RANGE'
            }
          ],
          BillingMode : 'PAY_PER_REQUEST',
          TableName: "${self:provider.environment.VIDEOS_TABLE}"
        }
      }
     }
   }
};

module.exports = serverlessConfiguration;
