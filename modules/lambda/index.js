const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME
  };

  try {
    const data = await docClient.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    };
  }
};
