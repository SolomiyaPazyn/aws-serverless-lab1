const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
exports.handler = async () => {
    const response = await docClient.send(new ScanCommand({ TableName: process.env.TABLE_NAME }));
    return { statusCode: 200, body: JSON.stringify(response.Items) };
};
