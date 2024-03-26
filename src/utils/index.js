const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const createStringHex = () => {
  return crypto.randomBytes(64).toString('hex');
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

module.exports = {
  getInfoData,
  createStringHex,
  getSelectData,
};
