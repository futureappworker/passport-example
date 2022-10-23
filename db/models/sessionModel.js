const { Model, DataTypes, Op } = require('sequelize');
const moment = require('moment');

const sequelize = require('../sequelize');

class Session extends Model {
  static async getLastUserSession({ id = '' } = {}) {
    if (!id) {
      return null;
    }
    const sessions = await Session.findAll({
      where: {
        userId: {
          [Op.eq]: id,
        },
      },
      order: [
        ['updatedAt', 'desc'],
      ],
      limit: 1,
      attributes: ['updatedAt'],
    });
    const session = sessions[0];
    return session;
  }

  static async getTodayActiveUserTotal({ todayStart = null } = {}) {
    const total = await Session.getActiveUserTotalByDay({
      todayStart,
    });
    return total;
  }

  static async getActiveUserTotalByDay({ todayStart, subtract = 0 } = {}) {
    let resultTodayStart = moment().startOf('day').valueOf();
    if (todayStart) {
      resultTodayStart = todayStart;
    }
    const start = moment(+resultTodayStart).subtract(subtract, 'days');
    const to = moment(+resultTodayStart).subtract(subtract, 'days').add(1, 'days');
    const total = await Session.count({
      where: {
        createdAt: {
          [Op.gt]: start,
          [Op.lt]: to,
        },
      },
      distinct: true,
      col: 'userId',
    });
    return total;
  }

  static async getLastSevenDayActiveUserAverage({ todayStart = null } = {}) {
    const promiseTotals = [];
    // subtract 0 to 6
    for (let i = 0; i <= 6; i += 1) {
      promiseTotals.push(
        Session.getActiveUserTotalByDay({
          todayStart,
          subtract: i,
        }),
      );
    }
    const totals = await Promise.all(promiseTotals);
    const average = totals.reduce((a, b) => a + b, 0) / totals.length;
    return Math.floor(average);
  }
}

Session.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'session',
  tableName: 'sessions',
  timestamps: false,
});

module.exports = Session;
