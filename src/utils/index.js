const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const createStringHex = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = {
  getInfoData,
  createStringHex,
};
