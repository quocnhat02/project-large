'use strict';

const { inventory } = require('../inventory.model');

const insertInventoryQuery = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  return await inventory.create({
    invent_productId: productId,
    invent_shopId: shopId,
    invent_stock: stock,
    invent_location: location,
  });
};

module.exports = {
  insertInventoryQuery,
};
