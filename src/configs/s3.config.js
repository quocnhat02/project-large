'use strict';

const { S3Client } = require('@aws-sdk/client-s3');

const s3Config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BUKCET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUKCET_SECRET_KEY,
  },
};

module.exports = new S3Client(s3Config);
