'use strict';

const { BadRequestError } = require('../core/error.response');
const { order } = require('../models/order.model');
const { findCartByIdQuery } = require('../models/repositories/cart.repo');
const {
  checkProductByServerQuery,
} = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await findCartByIdQuery(cartId);
    if (!foundCart) {
      throw BadRequestError('Cart does not exist');
    }

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      const checkProductServer = await checkProductByServerQuery(item_products);
      if (!checkProductServer[0]) {
        throw new BadRequestError('Order was wrong');
      }

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice = checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products,
      };

      if (shop_discounts.length > 0) {
        const { totalPrice, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    // check xem vuot ton kho ?
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        'Some products has updated, go back to cart again please'
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // insert thanh cong --> remove product trong cart
    if (newOrder) {
    }

    return newOrder;
  }

  /*
    1.query orders
  */
  static async getOrdersByUser() {}

  /*
    2.query order using id
  */
  static async getOneOrderByUser() {}
  /*
    3.cancel order using id
  */
  static async cancelOneOrderByUser() {}
  /*
    4.update order status
  */
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
