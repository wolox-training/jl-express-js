const { decoder, AUTHORIZATION } = require('../services/sessionManager'),
  errors = require('../errors'),
  { permission } = require('../controllers/enum'),
  User = require('../models').users;

const getUser = async auth => {
  const user = decoder(auth),
    result = await User.getUserBy(user.email);
  return result;
};

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers[AUTHORIZATION];

  if (auth) {
    const user = await getUser(auth);
    if (user) {
      next();
    } else {
      next(errors.authorizationError('Token invalid!'));
    }
  } else {
    next(errors.authorizationError('Token required!!!'));
  }
};

exports.verifyPermission = async (req, res, next) => {
  const auth = req.headers[AUTHORIZATION];

  const user = await getUser(auth);

  if (user.permission === permission.REGULAR) next(errors.authorizationError('Is not an admin user'));
  next();
};

exports.verifyAccessLevel = async (req, res, next) => {
  const auth = req.headers[AUTHORIZATION];

  const user = await getUser(auth);

  if (parseInt(user.id) !== parseInt(req.params.user_id) && user.permission === permission.REGULAR)
    next(errors.authorizationError('Only can access to your albums'));
  next();
};
