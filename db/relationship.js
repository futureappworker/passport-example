const {
  User,
  Profile,
  Provider,
  Session,
  EmailVerificationToken,
} = require('.');

const setup = () => {
  // User and Profile, One-To-One relationship
  User.Profile = User.hasOne(Profile);
  Profile.User = Profile.belongsTo(User);

  // User and Provider, One-To-One relationship
  User.Provider = User.hasOne(Provider);
  Provider.User = Provider.belongsTo(User);

  // User and Session, One-To-Many relationship
  User.hasMany(Session);
  Session.belongsTo(User);

  // User and EmailVerificationToken, One-To-One relationship
  User.EmailVerificationToken = User.hasOne(EmailVerificationToken);
  EmailVerificationToken.User = EmailVerificationToken.belongsTo(User);
};

module.exports = {
  setup,
};
