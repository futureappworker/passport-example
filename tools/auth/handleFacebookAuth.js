const { User } = require('../../db');

const handleFacebookAuth = async (parmas) => {
  const {
    providerId,
    name,
    email,
  } = parmas;
  let user;
  user = await User.findOneByFacebookProviderId({ providerId });
  if (user) {
    return user;
  }
  const profile = { name };
  if (email) {
    user = await User.findOneByEmail({ email });
    if (!user) {
      profile.email = email;
    }
  }
  user = await User.create({
    profile,
    provider: {
      providerId,
      providerType: 'facebook',
      name,
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

module.exports = handleFacebookAuth;
