const dynamoose = require('dynamoose');
require('dotenv').config('../.env');
dynamoose.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
    region: process.env.AWS_REGION
  });

const bookSchema = new dynamoose.Schema({
  id: {
    hashKey: true,
    type: String,
  },
  title:{
    type: String,
    required: [true,  "Title is required"]
  },
  price: {
    type: Number,
    required: [true,  "Price is required"]
  }
},
{
  timestamps: true,
});

module.exports = dynamoose.model('book', bookSchema);