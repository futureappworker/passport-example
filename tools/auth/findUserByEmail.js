const { User } = require('../../db');

const findUserByEmail = async ({ email }) => {
  const user = await User.findOneByEmail({ email });
  return user;
};

module.exports = findUserByEmail;
