const jwt = require('jsonwebtoken');

const { User, EmailVerificationToken } = require('../../db');
const sgMail = require('../sgMail');

let domain = '';
if (process.env.NODE_ENV === 'production') {
  domain = `https://${process.env.APP_DOMAIN}`;
}
if (process.env.NODE_ENV === 'development') {
  domain = `http://localhost:${process.env.SERVER_PORT}`;
}

const getEmailVerificationHTML = ({ jwtToken }) => (`
  <div style="margin: 0 auto; background: #ffffff; border: 1px solid #f0f0f0; padding: 30px; width: 600px;">
    <h2 style="margin: 0 0 30px 0; font-size: 24px; color: #294661">
      You're on your way!
      <br />
      Let's confirm your email address.
    </h2>
    <p style="margin: 0 0 30px 0; font-size: 16px;">
      By clicking on the following link, you are confirming your email address.
    </p>
    <div style="text-align: center;">
      <a
        style="display: inline-block; margin: 0; padding: 12px 45px; border: solid 1px #348eda; background-color: #348eda; text-decoration: none; color: #ffffff; border-radius: 2px; font-size: 14px;"
        href="${domain}/confirmEmail?token=${jwtToken}"
        target="_blank"
      >
        Confirm Email Address
      </a>
    </div>
  </div>
`);

const sendEmailVerificationForEmail = async ({ userId, email }) => {
  const findEmailUser = await User.findOneByEmail({ email });

  if (findEmailUser && findEmailUser.id !== userId) {
    throw new Error('Email has been used.');
  }

  if (findEmailUser && findEmailUser.profile.isEmailVerified) {
    throw new Error('Email is verified.');
  }

  const emailVerificationToken = await EmailVerificationToken.createOrUpdateForEmail({
    userId,
  });

  const jwtToken = jwt.sign(
    {
      type: 'email',
      userId,
      email,
      verificationToken: emailVerificationToken.verificationToken,
    },
    process.env.TOKEN_SECRET,
  );

  const msg = {
    to: email,
    from: 'futureappworker@gmail.com',
    subject: `Welcome to ${process.env.APP_NAME}! Confirm Your Email`,
    html: getEmailVerificationHTML({ jwtToken }),
  };

  await sgMail.send(msg);

  return {
    userId,
    email,
    jwtToken,
  };
};

module.exports = sendEmailVerificationForEmail;
