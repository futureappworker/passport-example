const { Model, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const moment = require('moment');

const sequelize = require('../sequelize');

const Profile = require('./profileModel');
const Session = require('./sessionModel');

class User extends Model {
  static async getUserList({ offset, limit }) {
    const users = await User.findAll({
      attributes: ['id', 'signUpAt', 'lastSession', 'numberOfLogon'],
      offset,
      limit,
    });
    return users;
  }

  static async findOneById({ id }) {
    const user = await User.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      include: [{
        association: User.Profile,
        attributes: ['name', 'email', 'isEmailVerified'],
      }, {
        association: User.Provider,
        attributes: ['providerId', 'providerType', 'name'],
      }, {
        association: User.EmailVerificationToken,
        attributes: ['type', 'verificationToken', 'expireAt'],
      }],
    });
    return user;
  }

  static async findOneByEmail({ email }) {
    const user = await User.findOne({
      include: [{
        association: User.Profile,
        attributes: ['name', 'email', 'isEmailVerified'],
        where: {
          email: {
            [Op.eq]: email,
          },
        },
      }, {
        association: User.Provider,
        attributes: ['providerId', 'providerType', 'name'],
      }],
    });
    return user;
  }

  static async findOneByFacebookProviderId({ providerId }) {
    const user = User.findOne({
      include: [{
        association: User.Profile,
        attributes: ['name', 'email', 'isEmailVerified'],
      }, {
        association: User.Provider,
        attributes: ['providerId', 'providerType', 'name'],
        where: {
          providerId: {
            [Op.eq]: providerId,
          },
          providerType: {
            [Op.eq]: 'facebook',
          },
        },
      }],
    });
    return user;
  }

  static async findOneByGoogleProviderId({ providerId }) {
    const user = User.findOne({
      include: [{
        association: User.Profile,
        attributes: ['name', 'email', 'isEmailVerified'],
      }, {
        association: User.Provider,
        attributes: ['providerId', 'providerType', 'name'],
        where: {
          providerId: {
            [Op.eq]: providerId,
          },
          providerType: {
            [Op.eq]: 'google',
          },
        },
      }],
    });
    return user;
  }

  static async addNumberOfLogon({ id, addNumber = 1 } = {}) {
    const user = await User.findOneById({ id });
    if (user) {
      await user.increment({
        numberOfLogon: addNumber,
      });
    }
  }

  static async updateNameById({ id, name = '' } = {}) {
    await Profile.update({
      name,
    }, {
      where: {
        userId: id,
      },
    });
    const user = await User.findOneById({ id });
    return user;
  }

  static async addSession({ id } = {}) {
    const user = await User.findOneById({ id });
    if (!user) {
      return;
    }
    const session = await Session.create({
      userId: id,
    });
    await user.update({
      lastSession: session.createdAt,
    });
    await user.save();
    return session;
  }

  static async getUserTotal() {
    const total = await User.count();
    return total;
  }

  static async resetPasswordById({ id = '', password = '' } = {}) {
    if (!id || !password) {
      return;
    }
    await User.update({
      hashedPassword: password,
    }, {
      where: {
        id,
      },
    });
    const user = await User.findOneById({ id });
    return user;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  hashedPassword: {
    type: DataTypes.STRING(60),
    set(value) {
      const SALT_ROUNDS = parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
      const hash = bcrypt.hashSync(value, SALT_ROUNDS);
      this.setDataValue('hashedPassword', hash);
    },
  },
  signUpAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      const rawValue = this.getDataValue('signUpAt');
      return moment(rawValue).valueOf();
    },
  },
  lastSession: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      const rawValue = this.getDataValue('lastSession');
      return moment(rawValue).valueOf();
    },
  },
  numberOfLogon: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'user',
  tableName: 'accounts',
  timestamps: false,
});

module.exports = User;
