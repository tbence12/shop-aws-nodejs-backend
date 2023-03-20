import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from '@libs/s3-functions';
import * as dotenv from 'dotenv';

dotenv.config();

export const importProductsFile = async (event) => {
  console.log('[importProductsFile] called, arguments: ', JSON.stringify(event.queryStringParameters));

  const { name } = event.queryStringParameters;

  if (!name) {
    return formatJSONResponse('Not found "name" query parameter', 400);
  }

  const bucket = process.env.BUCKET;
  const key = `uploaded/${name}`;

  const params = {
    Bucket: bucket,
    Key: key,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {
    const signedUrl = await S3.getSignedUrl('putObject', params);

    return formatJSONResponse(signedUrl);
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(importProductsFile);
