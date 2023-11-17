const express = require('express');
const accessRoutes = require('./access');

const router = express.Router();

router.use('/shop', accessRoutes);

module.exports = router;
