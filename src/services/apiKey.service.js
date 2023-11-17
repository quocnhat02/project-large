const apiKeyModel = require('../models/apiKey.model');
const crypto = require('crypto');

class ApiKeyService {
  static findApiKey = async (key) => {
    // const newKey = crypto.randomBytes(64).toString('hex');
    // const newApiKey = await apiKeyModel.create({
    //   key: newKey,
    //   permissions: ['0000'],
    // });

    // console.log(newApiKey);

    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
  };
}

module.exports = ApiKeyService;
