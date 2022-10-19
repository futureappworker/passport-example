const { Model, DataTypes } = require('sequelize');

const sequelize = require('../sequelize');

class Provider extends Model {
}

Provider.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  providerId: {
    type: DataTypes.STRING(128),
  },
  providerType: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: [['email', 'google', 'facebook']],
    },
  },
}, {
  sequelize,
  modelName: 'provider',
  tableName: 'providers',
  timestamps: false,
});

module.exports = Provider;
