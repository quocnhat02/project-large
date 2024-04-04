'use strict';

const { convertToObjectIdMongodb } = require('../../utils');
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

const reservationInventoryQuery = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reversation: {
          quantity,
          cartId,
          createdAt: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return await inventory.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventoryQuery,
  reservationInventoryQuery,
};
