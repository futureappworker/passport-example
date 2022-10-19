const jwt = require('jsonwebtoken');

const getDecodedToken = ({ token }) => {
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  return decoded;
};

module.exports = getDecodedToken;
