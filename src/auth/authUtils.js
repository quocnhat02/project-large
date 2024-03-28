'use strict';

const JWT = require('jsonwebtoken');
const { handleAsync } = require('../helpers/handleAsync');
const { HEADER } = require('../constants');
const {
  UnauthorizedRequestError,
  NotFoundRequestError,
} = require('../core/error.response');
const KeyTokenService = require('../services/keyToken.service');

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '2 days',
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify:`, err);
      } else {
        console.log(`decode verify:`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

// const authentication = handleAsync(async (req, res, next) => {
//   // check userId is missing ?
//   // get accessToken
//   // verify token
//   // check user in db
//   // check keyStore with this userId
//   // return next

//   const userId = req.headers[HEADER.CLIENT_ID];
//   if (!userId) {
//     throw new UnauthorizedRequestError('Invalid Request');
//   }

//   const keyStore = await KeyTokenService.findByUserId(userId);
//   if (!keyStore) {
//     throw new NotFoundRequestError('Not found keyStore');
//   }

//   const accessToken = req.headers[HEADER.AUTHORIZATION];
//   if (!accessToken) {
//     throw new UnauthorizedRequestError('Invalid Request');
//   }

//   try {
//     const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
//     if (userId !== decodedUser.userId) {
//       throw new UnauthorizedRequestError('Invalid UserId');
//     }
//     req.keyStore = keyStore;
//     req.user = decodedUser; // {userId, email}
//     return next();
//   } catch (error) {
//     throw error;
//   }
// });

const authentication = handleAsync(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedRequestError('Invalid Request');
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundRequestError('Not found keyStore');
  }

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodedUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodedUser.userId) {
        throw new UnauthorizedRequestError('Invalid UserId');
      }
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodedUser; // {userId, email}
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedRequestError('Invalid Request');
  }

  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodedUser.userId) {
      throw new UnauthorizedRequestError('Invalid UserId');
    }
    req.keyStore = keyStore;
    req.user = decodedUser; // {userId, email}
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
