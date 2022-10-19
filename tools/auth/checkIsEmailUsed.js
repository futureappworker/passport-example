const { User } = require('../../db');

const checkIsEmailUsed = async ({ email }) => {
  const user = await User.findOneByEmail({ email });
  return user !== null;
};

module.exports = checkIsEmailUsed;
