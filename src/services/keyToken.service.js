'use strict';

const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // lv 0
      //   const tokens = await keyTokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey,
      //   });

      //   return tokens ? tokens : null;

      // lv xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static deleteKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(id).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };

  static findByTokenAndUpdate = async (id, tokens, refreshToken) => {
    return await keyTokenModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            refreshToken: tokens.refreshToken,
          },
          $addToSet: {
            refreshTokensUsed: refreshToken,
          },
        },
        {
          new: true,
        }
      )
      .lean();
  };

  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId }).lean();
  };
}

module.exports = KeyTokenService;
