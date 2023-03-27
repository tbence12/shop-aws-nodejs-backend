import { handlerPath } from '@libs/handler-resolver';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        authorizer: {
          arn: process.env.AUTHORIZER_ARN,
          type: 'request',
          resultTtlInSeconds: 0,
        },
      },
    },
  ],
};
