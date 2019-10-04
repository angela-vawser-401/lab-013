const tokenService = require('../token-service');

module.exports = () => (req, res, next) => {
  tokenService.sign(req.user)
    .then(payload => {
      if(payload.roles !== 'Admin') {
        next({
          statusCode: 401,
          error: 'Access Denied'
        });
        return;
      }
      next();
    });
};