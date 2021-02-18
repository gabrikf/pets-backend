const AWS = require('aws-sdk')


AWS.config.update({
  region: process.env.AWS_LOCAL,
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
})

const s3 = new AWS.S3()

module.exports = s3

