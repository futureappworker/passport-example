const { User } = require('../../db');

const getUserListAndPageInfo = async ({ offset, limit }) => {
  const users = await User.getUserList({ offset, limit });
  const userTotal = await User.getUserTotal();
  return {
    users,
    dataTotal: userTotal,
  };
};

module.exports = getUserListAndPageInfo;
