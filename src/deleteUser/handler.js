/* eslint-disable no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

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

export const deleteUser = async (event, context) => {
  const { id } = event.pathParameters;

  const params = {
    Key: { pk: id },
    TableName: 'usersPractitioner',
    ReturnValues: 'ALL_OLD',
  };

  try {
    const command = new DeleteCommand(params);
    const response = await documentClient.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ removed: id, response }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
