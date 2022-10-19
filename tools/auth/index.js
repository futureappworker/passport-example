const checkIsEmailUsed = require('./checkIsEmailUsed');
const validatePassword = require('./validatePassword');
const createUserByEmail = require('./createUserByEmail');
const findUserByEmail = require('./findUserByEmail');
const getToken = require('./getToken');
const getDecodedToken = require('./getDecodedToken');
const handleFacebookAuth = require('./handleFacebookAuth');
const handleGoogleAuth = require('./handleGoogleAuth');

module.exports = {
  checkIsEmailUsed,
  validatePassword,
  createUserByEmail,
  findUserByEmail,
  getToken,
  getDecodedToken,
  handleFacebookAuth,
  handleGoogleAuth,
};
