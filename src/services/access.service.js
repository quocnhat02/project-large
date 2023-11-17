const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const { _SALT_HASH_PASSWORD_, _ROLES_SHOP_ } = require('../configs/constants');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      return {
        code: 'xxxx',
        message: 'Shop already exist',
      };
    }

    const hashPassword = await bcrypt.hash(password, _SALT_HASH_PASSWORD_);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [_ROLES_SHOP_.SHOP],
    });

    if (newShop) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      console.log({ privateKey, publicKey });

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        return {
          code: 'xxxx',
          message: 'publicKeyString error',
        };
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      console.log('publicKeyObject: ', publicKeyObject);

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey
      );

      console.log(`Created token success: `, tokens);

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

    try {
    } catch (error) {
      return {
        code: 'xxx',
        status: 'error',
        message: error.message,
      };
    }
  };
}

module.exports = AccessService;
