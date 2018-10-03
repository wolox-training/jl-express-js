const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.SIGNUP_ERROR = 'invalid_signup';
exports.signupError = message => internalError(message, exports.SIGNUP_ERROR);

exports.SIGNIN_ERROR = 'invalid_signin';
exports.signInError = message => internalError(message, exports.SIGNIN_ERROR);
