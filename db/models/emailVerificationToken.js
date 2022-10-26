const { Model, DataTypes, Op } = require('sequelize');
const moment = require('moment');
const crypto = require('crypto');

const sequelize = require('../sequelize');

class EmailVerificationToken extends Model {
  static async createOrUpdateForEmail({ userId }) {
    const addTime = parseInt(process.env.EMAIL_VERIFICATION_FOR_EMAIL_EXPIRES_IN, 10);
    let emailVerificationToken = await EmailVerificationToken.findOne({
      where: {
        userId: {
          [Op.eq]: userId,
        },
        type: 'email',
      },
    });
    if (!emailVerificationToken) {
      const verificationToken = crypto.randomBytes(16).toString('hex');
      emailVerificationToken = await EmailVerificationToken.create({
        userId,
        type: 'email',
        verificationToken,
        expireAt: moment().valueOf() + addTime * 1000,
      });
    } else {
      const verificationToken = crypto.randomBytes(16).toString('hex');
      await EmailVerificationToken.update({
        verificationToken,
        expireAt: moment().valueOf() + addTime * 1000,
      }, {
        where: {
          userId: {
            [Op.eq]: userId,
          },
          type: 'email',
        },
      });
      emailVerificationToken = await EmailVerificationToken.findOne({
        where: {
          userId: {
            [Op.eq]: userId,
          },
          type: 'email',
        },
      });
    }
    return emailVerificationToken;
  }
}

EmailVerificationToken.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['email']],
    },
  },
  verificationToken: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  expireAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'emailVerificationToken',
  tableName: 'emailVerificationTokens',
  timestamps: false,
});

module.exports = EmailVerificationToken;
