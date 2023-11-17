const express = require('express');
const accessRoutes = require('./access');
const shopRoutes = require('./access');

const router = express.Router();

router.use('/', accessRoutes);
router.use('/shop', shopRoutes);

module.exports = router;
