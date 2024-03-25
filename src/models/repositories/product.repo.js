const { Types } = require('mongoose');
const {
  product,
  electronic,
  clothing,
  furniture,
} = require('../product.model');

const findAllDraftsForShopQuery = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedByShopQuery = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const unPublishProductByShopQuery = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) {
    return null;
  }
  const updatedProduct = await product.findByIdAndUpdate(
    product_id,
    {
      isDraft: true,
      isPublished: false,
    },
    {
      new: true,
    }
  );

  const modifiedCount = updatedProduct ? 1 : 0;

  return modifiedCount;
};

const publishProductByShopQuery = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) {
    return null;
  }
  const updatedProduct = await product.findByIdAndUpdate(
    product_id,
    {
      isDraft: false,
      isPublished: true,
    },
    {
      new: true,
    }
  );

  const modifiedCount = updatedProduct ? 1 : 0;

  return modifiedCount;
};

module.exports = {
  findAllDraftsForShopQuery,
  publishProductByShopQuery,
  findAllPublishedByShopQuery,
  unPublishProductByShopQuery,
};
