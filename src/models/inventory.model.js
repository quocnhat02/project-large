'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new mongoose.Schema(
  {
    invent_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    invent_location: {
      type: String,
      default: 'unknown',
    },
    invent_stock: {
      type: Number,
      required: true,
    },
    invent_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
    },
    invent_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  inventory: mongoose.model(DOCUMENT_NAME, inventorySchema),
};
