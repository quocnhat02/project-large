const express = require('express');
const { handleAsync } = require('../../helpers/handleAsync');
const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const router = express.Router();

// authentication
router.use(authentication);

// create
router.post('/', handleAsync(productController.createProduct));

module.exports = router;
