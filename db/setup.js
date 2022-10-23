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

  const promiseTestUserArray = [];
  for (let i = 0; i < 50; i += 1) {
    promiseTestUserArray.push(
      User.create({
        hashedPassword: 'qwerQWER1@',
        profile: {
          email: `test${i}@gmail.com`,
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
      }),
    );
  }
  await Promise.all(promiseTestUserArray);
};

module.exports = {
  run: async () => {
    await createTestUser();
  },
};
