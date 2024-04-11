'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk } = require('../../configs/multer.config');
const router = express.Router();

// router.use(authentication);

// upload image
router.post('/product', handleAsync(uploadController.uploadImageFromUrl));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  handleAsync(uploadController.uploadFileThumb)
);

module.exports = router;
