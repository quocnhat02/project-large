'use strict';

const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const UploadService = require('../services/upload.service');

class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: 'Upload image is successful',
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };
}

module.exports = new UploadController();
