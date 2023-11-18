const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static _createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
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
  static get createKeyToken() {
    return KeyTokenService._createKeyToken;
  }
  static set createKeyToken(value) {
    KeyTokenService._createKeyToken = value;
  }
}

module.exports = KeyTokenService;
