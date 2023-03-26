import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

import * as dotenv from 'dotenv';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME,
      STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME,
      QUEUE_URL: process.env.QUEUE_URL,
      SNS_ARN: process.env.SNS_ARN,
    },
    iam: {
      role: {
        managedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess'],
        statements: [
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] }
          },
          {
            Effect: 'Allow',
            Action: ['sns:*'],
            Resource: { Ref: 'SNSTopic' }
          }
        ]
      }
    }
  },
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      generateSwaggerOnDeploy: true,
      typefiles: ['./src/models/productModel.ts'],
      basePath: '/dev',
      host: 'bnd9i5exw3.execute-api.eu-central-1.amazonaws.com'
    }
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'bence_turi1@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      },
      SNSFilteredByPriceSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'turi.b12@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            'price': [{'numeric': ['>=', 15]}]
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
