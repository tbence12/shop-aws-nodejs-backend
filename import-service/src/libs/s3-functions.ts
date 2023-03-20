import * as AWS from 'aws-sdk';
import { S3Client, DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv';

dotenv.config();

const csv = require('csv-parser');

export const S3 = new AWS.S3({region: process.env.REGION});
const S3client = new S3Client({region: process.env.REGION});

const parseFile = (params) => {
  return new Promise<void>( (resolve, reject) => {
    const S3Stream = S3.getObject(params).createReadStream();
    const { Bucket, Key } = params;

    S3Stream
      .pipe(csv())
      .on('data', data => {
        console.log(`${Bucket}: ${Key}`, data);
      })
      .on('error', error => {
        console.log(`${Bucket}: ${Key} error: `, error);
        reject(new Error(error));
      })
      .on('end', () => {
        console.log(`${Bucket}: ${Key} parsing completed`);
        resolve();
      })
  });
}

const copyParsedFile = (params) => {
  return new Promise<void>(async (resolve, reject) => {
    const { Bucket, Key } = params;

    const copyParams = {
      CopySource: `${Bucket}/${Key}`,
      Bucket,
      Key: Key.replace('uploaded', 'parsed')
    }

    try {
      await S3client.send(new CopyObjectCommand(copyParams));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

const deleteParsedFile = (params) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await S3client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

const moveFile = async (params) => {
  await copyParsedFile(params);
  await deleteParsedFile(params);
}

export const fileParseAndMove = async (params) => {
  await parseFile(params);
  await moveFile(params);
}
