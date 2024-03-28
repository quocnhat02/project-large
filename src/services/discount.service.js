'use strict';

const {
  BadRequestError,
  NotFoundRequestError,
} = require('../core/error.response');
const { discount } = require('../models/discount.model');
const {
  findAllDiscountCodesUnSelect,
  findDiscountQuery,
} = require('../models/repositories/discount.repo');
const { findAllProductsQuery } = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');

/*
    Discount services
    1 - Generate discount code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      users_used,
      uses_count,
      max_uses_per_user,
    } = payload;
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError('Discount code has expired');
    // }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date');
    }

    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount is exist');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_value: max_value,
      discount_uses_count: uses_count,
      discount_user_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount_code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundRequestError('Discount do not exist');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products = null;

    if (discount_applies_to === 'all') {
      products = await findAllProductsQuery({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }
    if (discount_applies_to === 'specific') {
      products = await findAllProductsQuery({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      });
    }

    return products;
  }

  // get list discount_code by shopId
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId'],
      model: discount,
    });

    return discounts;
  }

  /* apply discount code
   products = [{
    productId,shopId,quantity,name,price
   }]
  */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await findDiscountQuery({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundRequestError('discount does not exist');
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_user_used,
      discount_max_uses_per_user,
    } = foundDiscount;

    if (!discount_is_active) {
      throw new NotFoundRequestError('discount has expired');
    }
    if (!discount_max_uses) {
      throw new NotFoundRequestError('discount are out');
    }

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundRequestError('Discount code has expired');
    }

    // check xem co gia tri toi thieu
    const totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundRequestError(
          `Discount requires a minium order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_user_used.find(
        (user) => user.userId == userId
      );
      if (userUsedDiscount) {
      }
    }

    // check xem fixed_amount hay percentage
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  }

  // Cancel discount code
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await findDiscountQuery({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundRequestError('discount does not exist');
    }

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
