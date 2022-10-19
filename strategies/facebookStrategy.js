const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile),
));
