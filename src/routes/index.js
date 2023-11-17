const express = require('express');
const accessRoutes = require('./access');
const shopRoutes = require('./shop');
const { getApiKey, permissionApiKey } = require('../auth/checkAuth');

const router = express.Router();

// check apiKey
router.use(getApiKey);

// check permission
router.use(permissionApiKey('0000'));

router.use('/', accessRoutes);
router.use('/shop', shopRoutes);

module.exports = router;
