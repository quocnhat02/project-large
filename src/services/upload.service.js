'use strict';

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const cloudinary = require('../configs/cloudinary.config');

const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand,
} = require('../configs/s3.config');
const { randomImageName } = require('../utils');

class UploadService {
  // upload file use S3Client
  static uploadImageFromLocalS3 = async ({ file }) => {
    try {
      const imageName = randomImageName();

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName, // file.originalname || 'unknown',
        Body: file.buffer,
        ContentType: 'image/jpg',
      });

      // export url

      const result = await s3.send(command);

      console.log('result:', result);

      const singedUrl = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
      });

      const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });
      console.log('url: ', url);

      return url;
      // return {
      //   image_url: result.secure_url,
      //   shopId: 8409,
      //   thumb_url: await cloudinary.url(result.public_id, {
      //     height: 100,
      //     width: 100,
      //     format: 'jpg',
      //   }),
      // };
    } catch (error) {
      console.error(error);
    }
  };

  // upload from url image
  static uploadImageFromUrl = async () => {
    try {
      const urlImage =
        'https://res-s.cloudinary.com/prod/image/upload/d_console:cld_new_default_cloud_logo_regular_padding.svg/w_32,h_32,c_fill,dpr_2.0/console/customer-logos/643abdaea10143beff0de421b1cd6e05';
      const folderName = 'product/shopId',
        newFileName = 'demo';

      const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
      });
      console.log('result:', result);
      return result.public_id;
    } catch (error) {
      console.error(error);
    }
  };

  //   upload image from local machine
  static uploadImageFromLocal = async ({
    path,
    folderName = 'product/8049',
  }) => {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: 'thumb',
        folder: folderName,
      });
      console.log('result:', result);
      return {
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg',
        }),
      };
    } catch (error) {
      console.error(error);
    }
  };

  //   upload multiple images from local machine
  static uploadImageFromLocalFiles = async ({
    files,
    folderName = 'product/8049',
  }) => {
    try {
      if (!files.length) {
        return;
      }

      const uploadUrls = [];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(path, {
          public_id: 'thumb',
          folder: folderName,
        });

        uploadUrls.push({
          image_url: result.secure_url,
          shopId: 8409,
          thumb_url: await cloudinary.url(result.public_id, {
            height: 100,
            width: 100,
            format: 'jpg',
          }),
        });
      }

      return uploadUrls;
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = UploadService;
