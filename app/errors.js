const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.EMAIL_ERROR = 'email_is_invalid';
exports.emailError = message => internalError(message, exports.EMAIL_ERROR);

exports.PASSWORD_ERROR = 'password_is_invalid';
exports.passwordError = message => internalError(message, exports.PASSWORD_ERROR);
