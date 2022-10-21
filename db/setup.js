const User = require('./models/userModel');

const createTestUser = async () => {
  await User.create({
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

  await User.create({
    hashedPassword: 'qwerQWER1@',
    profile: {
      email: 'bbb@gmail.com',
      isEmailVerified: false,
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
};

module.exports = {
  run: async () => {
    await createTestUser();
  },
};
