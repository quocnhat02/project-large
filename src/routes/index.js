const express = require('express');
const { checkApiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

// check apiKey
router.use(checkApiKey);

// check permissions
// router.use(checkPermission('0000'));

router.use('/v1/api', require('./access'));

module.exports = router;
