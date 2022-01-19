const AWS = require("aws-sdk");
const crypto = require("crypto");
const book = require('./models/bookModel');
const generateUUID = () => crypto.randomBytes(16).toString("hex");
const documentClient = new AWS.DynamoDB.DocumentClient();
const eventbridge = new AWS.EventBridge();

exports.handler = async event => {
  const { title,price } = JSON.parse(event.body);
    
  // console.log(event.body)
  try {
    
    // Creating book in DB
    const data = await book.create({
        id: generateUUID(),
        title: title,
        price: price  
    })

    // Passing Info in EventBridge params
    const params = {
        Entries: [ 
          {
            Detail: JSON.stringify({
              "state": "created",
              "id": data.id
            }),
            DetailType: 'New Book',
            Source: 'tyler.create-book',
          }
        ]
      }

    // Triggering EventBridge rule
      const result = await eventbridge.putEvents(params).promise()

      console.log(result)

    //   Sending Response
      const response = {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({data: JSON.stringify(data)})
      };
      return response; // Returning a 200 if the item has been inserted 
  } catch (e) {

    // Catching errors
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({msg: "Something went wrong! Please try again later"})
    };
  }
};