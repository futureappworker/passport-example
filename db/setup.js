const User = require('./models/userModel');

const createTestUser = async () => {
  let user;
  user = await User.create({
    hashedPassword: 'qwerQWER1@',
    profile: {
      email: 'aaa@gmail.com',
      isEmailVerified: 1,
    },
    provider: {
      providerType: 'email',
    },
    numberOfLogon: 1,
  }, {
    include: [{
      association: User.Profile,
    }, {
      association: User.Provider,
    }],
  });
  user = await User.findOneById({ id: user.id });
  console.log('==== user: ', user.toJSON());
};

module.exports = {
  run: async () => {
    await createTestUser();
  },
};
