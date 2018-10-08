const { decoder, AUTHORIZATION } = require('./../services/sessionManager'),
  errors = require('../errors'),
  User = require('../models').users;

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers[AUTHORIZATION];

  if (auth) {
    const user = decoder(auth);
    const result = await User.getUserBy(user.email);

    if (result) {
      next();
    } else {
      next(errors.authorizationError('Token invalid!'));
    }
  } else {
    next(errors.authorizationError('Token required!!!'));
  }
};
