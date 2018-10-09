const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.SIGNUP_ERROR = 'signup_error';
exports.signupError = message => internalError(message, exports.SIGNUP_ERROR);

exports.SIGNIN_ERROR = 'signin_error';
exports.signInError = message => internalError(message, exports.SIGNIN_ERROR);

exports.AUTHORIZATE_ERROR = 'authorization_error';
exports.authorizationError = message => internalError(message, exports.AUTHORIZATE_ERROR);

exports.ALBUMS_API_ERROR = 'albums_api_error';
exports.albumsApiError = message => internalError(message, exports.ALBUMS_API_ERROR);
