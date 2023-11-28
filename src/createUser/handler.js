/* eslint-disable no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const dynamoLocalConfig = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'DEFAULT',
    secretAccessKey: 'DEFAULT',
  },
};

const dynamoDBClient = new DynamoDBClient(process.env.IS_OFFLINE ? dynamoLocalConfig : {});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const createUser = async (event, context) => {
  const id = randomUUID();
  const userData = {
    ...JSON.parse(event.body),
    pk: id,
  };

  const params = {
    TableName: 'usersPractitioner',
    Item: userData,
  };

  try {
    const command = new PutCommand(params);
    const response = await documentClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
