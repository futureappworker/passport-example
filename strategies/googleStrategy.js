const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

let domain = '';
if (process.env.NODE_ENV === 'production') {
  domain = process.env.APP_DOMAIN;
}
if (process.env.NODE_ENV === 'development') {
  domain = `http://localhost:${process.env.SERVER_PORT}`;
}

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${domain}${process.env.GOOGLE_CALLBACK_PATHNAME}`,
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile),
));
