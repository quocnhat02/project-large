const { HEADER } = require('../constants');
const ApiKeyService = require('../services/apiKey.service');

const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Key',
      });
    }

    // check objKey
    const objKey = await ApiKeyService.findByKey(key);

    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden ObjectKey',
      });
    }

    req.objKey = objKey;

    return next();
  } catch (error) {
    return error;
  }
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    console.log('permission:', req.objKey.permissions);

    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    return next();
  };
};

const handleAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next);
  };
};

module.exports = {
  checkApiKey,
  checkPermission,
  handleAsync,
};
