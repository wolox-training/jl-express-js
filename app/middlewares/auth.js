const { decoder, AUTHORIZATION } = require('../services/sessionManager'),
  errors = require('../errors'),
  { permission } = require('../controllers/enum'),
  User = require('../models').users;

const getUser = async (auth, next) => {
  const user = decoder(auth);

  if (user.expiration <= Date.now()) next(errors.authorizationError('Access token has expired'));

  const result = await User.getUserBy(user.email);
  return result;
};

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers[AUTHORIZATION];

  if (auth) {
    const user = await getUser(auth, next);
    if (user) {
      next();
    } else {
      next(errors.authorizationError('Access Token is invalid!'));
    }
  } else {
    next(errors.authorizationError('Access Token is required!!!'));
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
