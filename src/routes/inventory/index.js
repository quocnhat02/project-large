'use strict';

const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const inventoryController = require('../../controllers/inventory.controller');
const router = express.Router();

router.use(authentication);

// inventory
router.post('', handleAsync(inventoryController.addStockToInventory));

module.exports = router;
