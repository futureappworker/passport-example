const { User } = require('../../db');

const createUserByEmail = async ({ email, password }) => {
  let user = await User.create({
    hashedPassword: password,
    profile: {
      email,
    },
    provider: {
      providerType: 'email',
    },
  }, {
    include: [{
      association: User.Profile,
    }, {
      association: User.Provider,
    }],
  });
  if (user) {
    user = await User.findOneById({ id: user.id });
    return user.toJSON();
  }
  return user;
};

module.exports = createUserByEmail;
