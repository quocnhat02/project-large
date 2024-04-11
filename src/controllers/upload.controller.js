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
    const files = req.files;
    console.log(files);
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new BadRequestError('No files found');
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        return await UploadService.uploadImageFromLocal({
          path: file.path,
        });
      })
    );

    new SuccessResponse({
      message: 'Upload files thumb is successful',
      metadata: uploadResults,
    }).send(res);
  };
}

module.exports = new UploadController();
