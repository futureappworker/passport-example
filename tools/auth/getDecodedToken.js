const jwt = require('jsonwebtoken');
const { Error } = require('sequelize');

const getDecodedToken = ({ token, type = 'auth' }) => {
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const { type: decodedType } = decoded;

  if (!decodedType) {
    throw new Error('Token error.');
  }

  if (decodedType !== type) {
    throw new Error('Token error.');
  }

  return decoded;
};

module.exports = getDecodedToken;
