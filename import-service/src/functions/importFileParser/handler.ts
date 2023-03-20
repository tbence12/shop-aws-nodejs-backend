import middy from '@middy/core';
import { fileParseAndMove } from '@libs/s3-functions';
import * as dotenv from 'dotenv';

dotenv.config();

export const importFileParser = async (event) => {
  console.log('[importFileParser] called, arguments: ', JSON.stringify(event));
  
  const key = decodeURIComponent(event.Records[0].s3.object.key);
  const bucket = process.env.BUCKET;

  const params = {
    Bucket: bucket,
    Key: key
  }

  try {
    await fileParseAndMove(params);
  } catch (error) {
    console.log(error);
  }
};

export const main = middy(importFileParser);
