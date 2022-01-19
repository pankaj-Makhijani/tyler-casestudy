const AWS = require("aws-sdk");
const book = require('./models/bookModel');
require('dotenv').config('./.env');
exports.handler = async event => {
  try {
    const data = await book.scan({id: event.detail.id}).exec();
    
    // Create publish parameters
    var params = {
      Message: `New book ${data[0].title} created having price ${data[0].price}`,
      TopicArn: "arn:aws:sns:us-east-1:853148436043:tylerTopic"
    };
 
    // Create promise and SNS service object
    await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    console.log(data[0]);
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({msg: "Something went wrong! Please try again later"})
    };
  }
};