import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';

export const importProductsFile = async (event) => {
  console.log('[importProductsFile] called, arguments: ', JSON.stringify(event.queryStringParameters));

  const queryParams = event.queryStringParameters;

  if (!queryParams?.name) {
    return formatJSONResponse('Not found "name" query parameter', 400);
  }

  const { name } = queryParams;
  const S3 = new AWS.S3({region: 'eu-central-1'});
  const bucket = 'js-shop-react-redux-uploaded';
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
