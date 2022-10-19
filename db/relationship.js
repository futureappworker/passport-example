const {
  User,
  Profile,
  Provider,
} = require('.');

const setup = () => {
  // User and Profile, One-To-One relationship
  User.Profile = User.hasOne(Profile);
  Profile.User = Profile.belongsTo(User);

  // User and Provider, One-To-One relationship
  User.Provider = User.hasOne(Provider);
  Provider.User = Provider.belongsTo(User);
};

module.exports = {
  setup,
};
