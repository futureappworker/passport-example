const jwt = require('jsonwebtoken');

const getToken = ({ id }) => {
  const expiresIn = parseInt(process.env.TOKEN_EXPIRES_IN, 10);

  const token = jwt.sign(
    {
      id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn,
    },
  );

  return token;
};

module.exports = getToken;
