'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: ORDER success
// ORDER-002: ORDER failed
// PROMOTION-001: new promotion
// SHOP-001: new product by user following

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
      required: true,
    },
    noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    noti_receivedId: {
      type: Number,
      required: true,
    },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  Notification: model(DOCUMENT_NAME, notificationSchema),
};
