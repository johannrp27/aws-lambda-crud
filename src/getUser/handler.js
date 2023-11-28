/* eslint-disable no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

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

export const getUser = async (event, context) => {
  const { id } = event.pathParameters;

  const params = {
    TableName: 'usersPractitioner',
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: { ':pk': id },
  };

  try {
    const { Items } = await documentClient.send(new QueryCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ user: Items }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
