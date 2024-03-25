const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

// authentication
router.use(authentication);

// create
router.post('/', handleAsync(productController.createProduct));

// publish and unpublish
router.post(
  '/published/:id',
  handleAsync(productController.publishProductByShop)
);
router.post(
  '/unpublished/:id',
  handleAsync(productController.unPublishProductByShop)
);

// QUERY
router.get('/drafts/all', handleAsync(productController.getAllDraftsForShop));
router.get(
  '/published/all',
  handleAsync(productController.getAllPublishedByShop)
);

module.exports = router;
