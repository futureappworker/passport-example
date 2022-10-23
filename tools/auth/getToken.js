const jwt = require('jsonwebtoken');

const { User } = require('../../db');

const getToken = async ({ id }) => {
  const expiresIn = parseInt(process.env.TOKEN_EXPIRES_IN, 10);

  await User.addSession({ id });

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
