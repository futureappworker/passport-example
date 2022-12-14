const User = require('./models/userModel');
const Profile = require('./models/profileModel');
const Provider = require('./models/providerModel');
const Session = require('./models/sessionModel');
const EmailVerificationToken = require('./models/emailVerificationToken');

module.exports = {
  User,
  Profile,
  Provider,
  Session,
  EmailVerificationToken,
};
