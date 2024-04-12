'use strict';

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BUKCET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUKCET_SECRET_KEY,
  },
};

const s3 = new S3Client(s3Config);

module.exports = { s3, PutObjectCommand };
