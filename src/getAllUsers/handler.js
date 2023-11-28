/* eslint-disable no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

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

export const getUsers = async (event, context) => {
  const params = {
    TableName: 'usersPractitioner',
  };

  try {
    const { Items } = await documentClient.send(new ScanCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ users: Items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
