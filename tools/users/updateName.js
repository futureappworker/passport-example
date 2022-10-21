const { User } = require('../../db');

const updateName = async ({ id, name }) => {
  const user = await User.updateNameById({ id, name });
  return user;
};

module.exports = updateName;
