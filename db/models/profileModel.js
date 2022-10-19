const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize');

class Profile extends Model {
}

Profile.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
  },
  email: {
    type: DataTypes.STRING(50),
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'profile',
  tableName: 'profiles',
  timestamps: false,
});

module.exports = Profile;
