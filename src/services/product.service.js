'use strict';

const { BadRequestError } = require('../core/error.response');
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const {
  insertInventoryQuery,
} = require('../models/repositories/inventory.repo');
const {
  findAllDraftsForShopQuery,
  findAllPublishedByShopQuery,
  publishProductByShopQuery,
  unPublishProductByShopQuery,
  searchProductByUserQuery,
  findAllProductsQuery,
  findProductQuery,
  updateProductQuery,
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');

// design Factory class to create product
class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError('Not create new product');
    }

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError('Not update product');
    }

    return new productClass(payload).updateProduct(productId);
  }

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShopQuery({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShopQuery({ product_shop, product_id });
  }
  // END PUT //

  //  query //
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShopQuery({ query, limit, skip });
  }

  static async findAllPublishedByShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedByShopQuery({ query, limit, skip });
  }
  //  end query //

  //   search
  static async searchProducts({ keySearch }) {
    return await searchProductByUserQuery({ keySearch });
  }

  static async findProduct({ product_id }) {
    return await findProductQuery({
      product_id,
      unSelect: ['__v', 'product_variations'],
    });
  }

  static async searchAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProductsQuery({
      limit,
      sort,
      page,
      filter,
      select: [
        'product_name',
        'product_price',
        'product_thumb',
        'product_shop',
      ],
    });
  }
  static async searchProduct({ keySearch }) {
    return await searchProductByUserQuery({ keySearch });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product_stock in inventory collection
      await insertInventoryQuery({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductQuery({ productId, payload, model: product });
  }
}

// define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError('Not create new Clothing');
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError('Not create new Product');
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objetParams = removeUndefinedObject(this);

    if (objetParams.product_attributes) {
      // update child
      await updateProductQuery({
        productId,
        payload: updateNestedObjectParser(objetParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objetParams)
    );

    return updateProduct;
  }
}

// define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError('Not create new Electronic');
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError('Not create new Product');
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objetParams = removeUndefinedObject(this);

    if (objetParams.product_attributes) {
      // update child
      await updateProductQuery({
        productId,
        payload: updateNestedObjectParser(objetParams.product_attributes),
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objetParams)
    );

    return updateProduct;
  }
}

// define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError('Not create new Furniture');
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError('Not create new Product');
    }

    return newProduct;
  }

  async updateProduct(productId) {
    const objetParams = removeUndefinedObject(this);

    if (objetParams.product_attributes) {
      // update child
      await updateProductQuery({
        productId,
        payload: updateNestedObjectParser(objetParams.product_attributes),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objetParams)
    );

    return updateProduct;
  }
}

// register product_type
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
