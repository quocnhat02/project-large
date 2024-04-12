'use strict';

const { BadRequestError } = require('../core/error.response');
const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: 'Upload image is successful',
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };
  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    console.log(file);
    if (!file) {
      throw new BadRequestError('File Thumb does not found');
    }
    new SuccessResponse({
      message: 'Upload file thumb is successful',
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
  uploadFileThumbs = async (req, res, next) => {
    const { files } = req;

    if (!files) {
      throw new BadRequestError('File Thumb does not found');
    }
    new SuccessResponse({
      message: 'Upload files thumb is successful',
      metadata: await UploadService.uploadImageFromLocalFiles({
        files,
      }),
    }).send(res);
  };

  // use s3
  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;

    if (!file) {
      throw new BadRequestError('File Thumb does not found');
    }
    new SuccessResponse({
      message: 'Upload file thumb is successful use S3Client',
      metadata: await UploadService.uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
