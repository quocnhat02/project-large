const { _HEADERS_ } = require('../configs/constants');
const ApiKeyService = require('../services/apiKey.service');

const getApiKey = async (req, res, next) => {
  try {
    const key = req.headers[_HEADERS_.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden apiKey',
      });
    }

    const objectKey = await ApiKeyService.findApiKey(key);
    if (!objectKey) {
      return res.status(403).json({
        message: 'Forbidden apiKey object',
      });
    }

    req.objectKey = objectKey;

    return next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const permissionApiKey = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    console.log('permission: ', req.objectKey.permissions);
    const validPermission = req.objectKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }
    return next();
  };
};

module.exports = { getApiKey, permissionApiKey };
