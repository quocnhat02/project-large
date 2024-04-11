'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const uploadController = require('../../controllers/upload.controller');
const router = express.Router();

// router.use(authentication);

// upload image
router.post('/product', handleAsync(uploadController.uploadImageFromUrl));

module.exports = router;
