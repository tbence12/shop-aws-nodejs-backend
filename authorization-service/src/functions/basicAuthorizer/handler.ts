import middy from '@middy/core';
import * as dotenv from 'dotenv';

dotenv.config();

const unauthorizedError = new Error('Unauthorized');

const basicAuthorizer = async (event) => {
  console.log('[basicAuthorizer] called, arguments: ', JSON.stringify(event));

  const authToken = event.headers["Authorization"]?.split(' ')[1];
  if (!authToken) {
    throw unauthorizedError;
  }

  console.log('authToken: ', authToken);
  
  const credentials = Buffer.from(authToken, "base64").toString().split(":");
  
  const [username, password] = credentials;
  
  const passwordInEnv = process.env[username];
  
  if (password === passwordInEnv) {
    return generatePolicy(username, event.methodArn, "Allow");
  } else {
    return generatePolicy(username, event.methodArn, "Deny");
  }
};

const generatePolicy = (principalId, resource, effect) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };
};

export const main = middy(basicAuthorizer);
