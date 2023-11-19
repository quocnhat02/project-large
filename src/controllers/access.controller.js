const { OK, CREATED } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    return new OK({
      message: 'Success: Get token',
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
  logout = async (req, res, next) => {
    return new OK({
      message: 'Success: Logout',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res, next) => {
    return new OK({
      message: 'Success: Login',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    return new CREATED({
      message: 'Success: Registered',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
    // return res.status(201).json(await AccessService.signUp(req.body));
  };
}

module.exports = new AccessController();
