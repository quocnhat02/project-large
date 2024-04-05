'use strict';

const express = require('express');
const { checkApiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(checkApiKey);

// check permissions
router.use(checkPermission('0000'));

router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/inventory', require('./inventory'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/comment', require('./comment'));
router.use('/v1/api', require('./access'));

module.exports = router;
