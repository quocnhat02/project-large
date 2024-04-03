'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active',
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, default: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
    /*
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn',
    }
    */
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
