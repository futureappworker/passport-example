const { User, Session } = require('../../db');

const getUserStatistics = async ({ todayStart } = {}) => {
  const userTotal = await User.getUserTotal();
  const todayActiveUserTotal = await Session.getTodayActiveUserTotal({
    todayStart,
  });
  const lastSevenDayActiveUserAverage = await Session.getLastSevenDayActiveUserAverage({
    todayStart,
  });
  const userStatistics = {
    userTotal,
    todayActiveUserTotal,
    lastSevenDayActiveUserAverage,
  };
  return userStatistics;
};

module.exports = getUserStatistics;
