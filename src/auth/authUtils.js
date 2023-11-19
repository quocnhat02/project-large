const JWT = require('jsonwebtoken');
const handleAsync = require('../helpers/handlerAsync');
const { _HEADERS_ } = require('../configs/constants');
const {
  UnAuthorizedRequestError,
  NotFoundRequestError,
} = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: '2 days',
  });

  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: '7 days',
  });

  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      console.error(`error verify: `, err);
    } else {
      console.log(`decode verify: `, decode);
    }
  });

  return { accessToken, refreshToken };
};

const authentication = handleAsync(async (req, res, next) => {
  const userId = req.headers[_HEADERS_.CLIENT_ID];
  if (!userId) {
    throw new UnAuthorizedRequestError('Invalid Request');
  }

  const keyStore = await findByUserId(userId);
  console.log('KEYSTORE,', keyStore);
  if (!keyStore) {
    throw new NotFoundRequestError('Not found keyStore');
  }

  const accessToken = req.headers[_HEADERS_.AUTHORIZATION];
  console.log('accessToken:', accessToken);
  if (!accessToken) {
    throw new UnAuthorizedRequestError('Invalid Request');
  }

  try {
    console.log('before decode:', keyStore);
    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
    console.log('decodeUser:', decodeUser);
    if (userId !== decodeUser.userId) {
      throw new UnAuthorizedRequestError('Invalid UserId');
    }

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyJWT };
