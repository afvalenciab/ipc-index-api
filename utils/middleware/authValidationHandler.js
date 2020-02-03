const boom = require('@hapi/boom');

const authValidationHandler = () => {
  return (req, res, next) => {
    if(!req.user) {
      next(boom.unauthorized('Missing Permission'));
    }

    if(req.user.isAdmin) {
      return next();
    } else {
      next(boom.unauthorized('Insufficient Permission'));
    }
  };
};

module.exports = authValidationHandler;
