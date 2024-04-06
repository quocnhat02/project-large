'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router();

// not login

// authentication
router.use(authentication);

// create
router.get('/', handleAsync(notificationController.listNotiByUser));

module.exports = router;
