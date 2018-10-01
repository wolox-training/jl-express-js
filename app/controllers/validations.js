'use strict';

const validateEmail = email => /^\w+([\.-]?\w+)@wolox+(\.\w{2,3})+$/.test(email),
  validatePassword = password => /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(password);

const fillErrorsArray = (array, message) => {
  array.push(message);
};

exports.validateUser = user => {
  const signErrors = [];
  if (!validateEmail(user.email)) fillErrorsArray(signErrors, 'invalid email');
  if (!validatePassword(user.password)) fillErrorsArray(signErrors, 'invalid password');

  for (const member in user) {
    if (user[member] === undefined) fillErrorsArray(signErrors, 'missing value');
  }
  return signErrors;
};
