const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Op } = require('sequelize');

const sequelize = require('../../db/sequelize');

const { User, Profile, EmailVerificationToken } = require('../../db');

const confirmEmail = async ({ token }) => {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    throw new Error(err.message);
  }

  const {
    type,
    userId,
    email,
    verificationToken,
  } = decoded;

  if (type !== 'email' || !userId || !email || !verificationToken) {
    throw new Error('Bad Request.');
  }

  const user = await User.findOneById({ id: userId });
  if (user && user.profile.isEmailVerified) {
    return;
  }

  const emailVerificationToken = await EmailVerificationToken.findOne({
    where: {
      type: 'email',
      verificationToken: {
        [Op.eq]: verificationToken,
      },
    },
    attributes: ['id', 'expireAt'],
  });

  if (!emailVerificationToken) {
    throw new Error('Bad Request.');
  }

  const {
    expireAt,
  } = emailVerificationToken;
  if (moment().valueOf() > moment(expireAt).valueOf()) {
    await emailVerificationToken.destroy();
    throw new Error('Token expired.');
  }

  await sequelize.transaction(async (t) => {
    await Profile.update({
      isEmailVerified: true,
      email,
    }, {
      where: {
        userId,
      },
      transaction: t,
    });
    await emailVerificationToken.destroy({
      transaction: t,
    });
  });
};

module.exports = confirmEmail;
