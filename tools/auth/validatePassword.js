const validate = require('validate.js');

const validatePassword = ({ password }) => {
  let result = validate(
    {
      password,
    },
    {
      password: {
        presence: {
          allowEmpty: false,
          message: 'is required',
        },
        length: {
          minimum: 8,
          tooShort: 'contains at least %{count} characters',
        },
      },
    },
  );
  if (!result) {
    result = { password: [] };
  }
  if (!/[a-z]/g.test(password)) {
    result.password.push('contains at least one lower character');
  }
  if (!/[A-Z]/g.test(password)) {
    result.password.push('contains at least one upper character');
  }
  if (!/[0-9]/g.test(password)) {
    result.password.push('contains at least one digit character');
  }
  if (!/[@#$%^&+=]/g.test(password)) {
    result.password.push('contains at least one special character, e.g. @#$%^&+=');
  }
  if (result.password.length === 0) {
    result = undefined;
  }
  return {
    isValidate: !result,
    errors: result,
  };
};

module.exports = validatePassword;
