const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;

let domain = '';
if (process.env.NODE_ENV === 'production') {
  domain = process.env.APP_DOMAIN;
}
if (process.env.NODE_ENV === 'development') {
  domain = `http://localhost:${process.env.SERVER_PORT}`;
}

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${domain}${process.env.FACEBOOK_CALLBACK_PATHNAME}`,
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile),
));
