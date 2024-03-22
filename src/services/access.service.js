const { ROLE_SHOP, SALT } = require('../constants');
const shopModel = require('../models/shop.model');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('Shop is already registered');
    }

    const hashPassword = await bcrypt.hash(password, SALT);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [ROLE_SHOP.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('keyStore was not created');
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        keyStore.publicKey,
        keyStore.privateKey
      );

      console.log(`Created Token Success:`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    throw new BadRequestError('Not created');
  };
}

module.exports = AccessService;
