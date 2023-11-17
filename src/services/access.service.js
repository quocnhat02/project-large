const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const { _SALT_HASH_PASSWORD_, _ROLES_SHOP_ } = require('../configs/constants');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('Error: Shop already exist');
    }

    const hashPassword = await bcrypt.hash(password, _SALT_HASH_PASSWORD_);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [_ROLES_SHOP_.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      //   console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'keyStore error',
        };
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        keyStore,
        privateKey
      );

      //   console.log(`Created token success: `, tokens);

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

    return {
      code: 201,
      metadata: null,
    };
  };
}

module.exports = AccessService;
