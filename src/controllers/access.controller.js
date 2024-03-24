const { CREATED, OK, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout is successful',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: 'Login is successful',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Sign up is successful',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
