'use strict';

const validateEmail = email => /^\w+([\.-]?\w+)@wolox+(\.\w{2,3})+$/.test(email),
  validatePassword = password => /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(password);

exports.validations = user => {
  const signErrors = [];
  if (!validateEmail(user.email)) signErrors.push('invalid email');
  if (!validatePassword(user.password)) signErrors.push('invalid password');

  for (const member in user) {
    if (user[member] === undefined) signErrors.push('missing value');
  }
  return signErrors;
};
