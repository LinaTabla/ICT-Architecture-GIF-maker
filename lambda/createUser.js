
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
exports.handler = async (event) => {
    // get parameters
    const email = event.queryStringParameters.email;
    const password=event.queryStringParameters.password;
    console.log(password+" "+email)
  
    
    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
    var params = {
      TableName: "user",
      Key: {
        "userEmail": {
          "S": email
          
        }
      }
    };
    

// Call DynamoDB to add the item to the table
try{
  var result= await ddb.getItem(params).promise();
  console.log(result.Item)
  if(result.Item.userEmail.S===email){
      // email bestaat al 
      const response = {
        statusCode: 200,
        body: JSON.stringify('bad'),
        headers: {
      'Access-Control-Allow-Origin': '*'
    }
    };
    return response;

  }else{
    // nieuwe email
    var user ={
        TableName: "user",
        Item:{
            "userEmail":email,
            "passwoord":password
        }
    }
    ddb.putItem(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
      const response = {
        statusCode: 200,
        body: JSON.stringify('good'),
        headers: {
      'Access-Control-Allow-Origin': '*'
    }
    };
    return response;
  }

  
}catch(err){
  console.log(err)
     var user ={
        TableName: "user",
        Item:{
            "userEmail":{"S":email},
            "passwoord":{"S":password}
        }
    }
    var werk = await ddb.putItem(user).promise()
      const response = {
        statusCode: 200,
        body: JSON.stringify('good'),
        headers: {
      'Access-Control-Allow-Origin': '*'
    }
    };
    return response;
}
};
