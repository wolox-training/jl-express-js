'use strict';

const validateEmail = user => {
  if (!/^\w+([\.-]?\w+)@wolox+(\.\w{2,3})+$/.test(user.email))
    return { valid: false, message: 'invalid email' };
  return { valid: true };
};

const validatePassword = user => {
  if (!/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/.test(user.password))
    return { valid: false, message: 'invalid password' };
  return { valid: true };
};

const validateMissingValues = user => {
  for (const member in user) {
    if (user[member] === undefined) return { message: 'missing value' };
  }
  return { valid: true };
};

const checkValidations = (validations, object) =>
  validations.reduce(
    (result, validation) => {
      const validationResult = validation(object);

      if (!validationResult.valid) {
        result.valid = false;
        result.messages.push(validationResult.message);
      }
      return result;
    },
    {
      valid: true,
      messages: []
    }
  );

exports.validateUser = user =>
  checkValidations([validateEmail, validatePassword, validateMissingValues], user);

exports.validateQuery = query => checkValidations([validateMissingValues], query);
