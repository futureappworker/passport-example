const { User } = require('../../db');

const handleGoogleAuth = async (parmas) => {
  const {
    providerId,
    name,
    email,
  } = parmas;
  let user;
  user = await User.findOneByGoogleProviderId({ providerId });
  if (user) {
    return user;
  }
  const profile = { name };
  if (email) {
    user = await User.findOneByEmail({ email });
    if (user) {
      throw new Error('Email already registered.');
    }
    if (!user) {
      profile.email = email;
    }
  }
  user = await User.create({
    profile,
    provider: {
      providerId,
      providerType: 'google',
    },
  }, {
    include: [{
      association: User.Profile,
    }, {
      association: User.Provider,
    }],
  });
  user = await User.findOneById({ id: user.id });
  return user;
};

module.exports = handleGoogleAuth;
