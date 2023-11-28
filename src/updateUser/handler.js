/* eslint-disable no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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

export const updateUser = async (event, context) => {
  const { id } = event.pathParameters;
  const { name, phone, age } = JSON.parse(event.body);

  const params = {
    Key: { pk: id },
    TableName: 'usersPractitioner',
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'SET #n = :name , #p = :phone , #a = :age',
    ExpressionAttributeValues: {
      ':name': name,
      ':phone': phone,
      ':age': age,
    },
    ExpressionAttributeNames: {
      '#n': 'name',
      '#p': 'phone',
      '#a': 'age',
    },
  };

  try {
    const command = new UpdateCommand(params);
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
