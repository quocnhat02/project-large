'use strict';

const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const ProductFactory = require('../services/product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: 'Create new product is successful',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update product is successful',
      metadata: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product is successful',
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'UnPublish product is successful',
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft is successful',
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Draft is successful',
      metadata: await ProductFactory.findAllPublishedByShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list search product is successful',
      metadata: await ProductFactory.searchProducts(req.params),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all product is successful',
      metadata: await ProductFactory.searchAllProducts(req.query),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get product is successful',
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
