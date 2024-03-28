'use strict';

const ROLE_SHOP = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

const SALT = 10;

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESH_TOKEN: 'x-rtoken-id',
};

// const PRODUCTS = {
//   Electronic,
//   Clothing,
//   Furniture,
// };

module.exports = { ROLE_SHOP, SALT, HEADER };
