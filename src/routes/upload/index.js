'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');
const router = express.Router();

// router.use(authentication);

// upload image
router.post('/product', handleAsync(uploadController.uploadImageFromUrl));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  handleAsync(uploadController.uploadFileThumb)
);
router.post(
  '/product/multiple',
  uploadDisk.array('files', 3),
  handleAsync(uploadController.uploadFileThumbs)
);

// use s3
router.post(
  '/product/bucket',
  uploadMemory.single('file'),
  handleAsync(uploadController.uploadImageFromLocalS3)
);

module.exports = router;
