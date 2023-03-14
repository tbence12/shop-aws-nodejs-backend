import { S3Client, DeleteObjectCommand, CopyObjectCommand } from "@aws-sdk/client-s3";

const csv = require('csv-parser');

const parseFile = async (S3, params) => {
  return new Promise<void>(async (resolve, reject) => {
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

const copyParsedFile = async (S3, params) => {
  return new Promise<void>(async (resolve, reject) => {
    const { Bucket, Key } = params;

    const copyParams = {
      CopySource: `${Bucket}/${Key}`,
      Bucket,
      Key: Key.replace('uploaded', 'parsed')
    }

    try {
      await S3.send(new CopyObjectCommand(copyParams));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

const deleteParsedFile = async (S3, params) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await S3.send(new DeleteObjectCommand(params));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

const moveFile = async (params) => {
  const S3 = new S3Client({ region: 'eu-central-1' });
  await copyParsedFile(S3, params);
  await deleteParsedFile(S3, params);
}

export const fileParseAndMove = async (S3, params) => {
  await parseFile(S3, params);
  await moveFile(params);
}
