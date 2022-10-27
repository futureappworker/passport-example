const bcrypt = require('bcrypt');

const { User } = require('../../db');

const resetPassword = async ({ id, oldPassword, newPassword }) => {
  let user = await User.findOneById({ id });
  if (!user) {
    throw new Error('User not found.');
  }

  const isSamePassword = bcrypt.compareSync(oldPassword, user.hashedPassword);
  if (!isSamePassword) {
    throw new Error('Old password is wrong.');
  }

  user = await User.resetPasswordById({ id, password: newPassword });
  return user;
};

module.exports = resetPassword;
