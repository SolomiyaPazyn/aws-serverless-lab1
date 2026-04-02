const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
exports.handler = async (event) => {
    const item = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    await docClient.send(new PutCommand({ TableName: process.env.TABLE_NAME, Item: item }));
    return { statusCode: 201, body: JSON.stringify(item) };
};
