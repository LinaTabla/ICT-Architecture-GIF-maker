const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    useAccelerateEndpoint: true,
});

exports.handler = async (event) => {
  const email = event.queryStringParameters.email;
  const id = uuidv4();
  
  const params = {
    Expires: 60 * 5,
    Bucket: 'images-group-8',
    Fields: {
      key: `${email}/${id}`,
    },
    Conditions: [
      ['content-length-range', 0, 100000000],
      ['starts-with', '$Content-Type', 'image/'],
    ],
  };
  
  let data = await createPresignedPostPromise(params);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ id, data }),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
  
}; 
  
function createPresignedPostPromise(params) {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    })
  });
}
