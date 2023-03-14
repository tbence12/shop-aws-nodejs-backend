import middy from '@middy/core';
import { fileParseAndMove } from '@libs/s3-functions';
import * as AWS from 'aws-sdk';

export const importFileParser = async (event) => {
  console.log('[importFileParser] called, arguments: ', JSON.stringify(event));

  const S3 = new AWS.S3({region: 'eu-central-1'});
  const key = decodeURIComponent(event.Records[0].s3.object.key);
  const bucket = 'js-shop-react-redux-uploaded';

  const params = {
    Bucket: bucket,
    Key: key
  }

  try {
    await fileParseAndMove(S3, params);
  } catch (error) {
    console.log(error);
  }
};

export const main = middy(importFileParser);
