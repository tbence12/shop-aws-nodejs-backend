import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {
         'Fn::GetAtt':['SQSQueue', 'Arn']
        },
        batchSize: 5
      },
    },
  ],
};
