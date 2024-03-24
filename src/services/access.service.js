const { ROLE_SHOP, SALT } = require('../constants');
const shopModel = require('../models/shop.model');

const bcrypt = require('bcrypt');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData, createStringHex } = require('../utils');
const {
  BadRequestError,
  UnauthorizedRequestError,
} = require('../core/error.response');
const ShopService = require('./shop.service');

class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.deleteKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await ShopService.findByShop({ email });
    if (!foundShop) {
      throw new BadRequestError('Shop was not registered');
    }

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new UnauthorizedRequestError('Unauthorized');
    }

    const privateKey = createStringHex();
    const publicKey = createStringHex();

    const { _id: userId } = foundShop._id;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('Shop was already registered');
    }

    const hashPassword = await bcrypt.hash(password, SALT);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [ROLE_SHOP.SHOP],
    });

    if (newShop) {
      const privateKey = createStringHex();
      const publicKey = createStringHex();

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
        publicKey,
        privateKey
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
