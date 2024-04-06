'use strict';

const { Notification } = require('../models/notification.model');

class NotificationService {
  static async pushNotiToSystem({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {},
  }) {
    let noti_content;

    if (type === 'SHOP-001') {
      noti_content = `@@@ vua them san pham moi: @@@`;
    } else if (type === 'PROMOTION-001') {
      noti_content = `@@@ vua them voucher moi: @@@@@`;
    }

    const newNoti = await Notification.create({
      noti_type: type,
      noti_content,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_options: options,
    });

    return newNoti;
  }
}

module.exports = NotificationService;
