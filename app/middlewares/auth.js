const { decoder, AUTHORIZATION } = require('./../services/sessionManager'),
  User = require('../models').users;

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers[AUTHORIZATION];

  if (auth) {
    const user = decoder(auth);
    const result = await User.getUserBy(user.email);

    if (result != null) {
      next();
    } else {
      res.status(401);
      res.end();
    }
  } else {
    res.status(401);
    res.end();
  }
};
