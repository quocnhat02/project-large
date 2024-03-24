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
    return await keyTokenModel.findByIdAndDelete(id);
  };
}

module.exports = KeyTokenService;
