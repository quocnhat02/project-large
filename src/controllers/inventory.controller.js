'use strict';

const { SuccessResponse } = require('../core/success.response');
const InventoryService = require('../services/inventory.service');

class InventoryController {
  // review
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new cart add to stock success',
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
