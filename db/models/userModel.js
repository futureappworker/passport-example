const { Model, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../sequelize');

class User extends Model {
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
        attributes: ['providerId', 'providerType'],
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
        attributes: ['providerId', 'providerType'],
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
        attributes: ['providerId', 'providerType'],
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
        attributes: ['providerId', 'providerType'],
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
  },
  lastSession: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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
