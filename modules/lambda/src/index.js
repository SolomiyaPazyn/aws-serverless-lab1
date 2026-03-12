const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    const tableName = process.env.TABLE_NAME;
    try {
        const command = new ScanCommand({ TableName: tableName });
        const data = await dynamo.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: { "Content-Type": "application/json" }
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
