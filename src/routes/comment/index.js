'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const commentController = require('../../controllers/comment.controller');
const router = express.Router();

// authentication
router.use(authentication);

// create
router.post('/', handleAsync(commentController.createComment));

module.exports = router;
