
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});
exports.handler = async (event) => {
    // TODO implement
    console.log(event)
    // const key = event.queryStringParameters.password;
    const response = {
        statusCode: 200,
        
        body: JSON.stringify('Hello from Lambda!'+event.queryStringParameters),
    };
    return response;
};