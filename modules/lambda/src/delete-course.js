const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
exports.handler = async (event) => {
    const id = event.pathParameters ? event.pathParameters.id : (event.id || "1");
    await docClient.send(new DeleteCommand({ TableName: process.env.TABLE_NAME, Key: { id: id } }));
    return { statusCode: 200, body: JSON.stringify({ deleted: id }) };
};
