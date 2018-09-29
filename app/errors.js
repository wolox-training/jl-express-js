const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.EMAIL_ERROR = 'email_is_invalid';
exports.emailError = () => internalError('Invalid email', exports.EMAIL_ERROR);

exports.PASSWORD_ERROR = 'password_is_invalid';
exports.passwordError = () => internalError('Invalid password', exports.PASSWORD_ERROR);

exports.EMAIL_DUPLICATE_ERROR = 'email_already_exist';
exports.emailDuplicateError = () => internalError('User already exist', exports.EMAIL_DUPLICATE_ERROR);

exports.SIGNUP_ERROR = 'invalid_signup';
exports.signupError = message => internalError(message, exports.SIGNUP_ERROR);
