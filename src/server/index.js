import express from 'express';
import path from 'path';
import session from 'express-session';
import sessionFileStore from 'session-file-store'
import passport from 'passport';
import googleOAuth from 'passport-google-oauth';
import dotenv from 'dotenv';
import uuid from 'uuid/v4';
import util from 'util';
import winston from 'winston';

dotenv.config();
winston.level = 'debug';
const logger = winston.createLogger({
  colorize: true,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      colorize: true
    })
  ]
});

import { OAUTH } from './constants';

const app = express();
const GoogleStrategy = googleOAuth.OAuth2Strategy;
const FileStore = sessionFileStore(session);

app.use(express.static(path.join(__dirname, './../../')));

passport.use(new GoogleStrategy({
    clientID: OAUTH.CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: "http://localhost:3030/siteSelect"
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info("profile.id: " + util.inspect(profile));
    return done(null, {username: 'tristan@summerinthecity.com', password: 'fa;ldkfj', id: profile.id}, {message: 'Invalid credentials\n'});
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
})

app.use(session({
  genid: (req) => {
    return uuid();
  },
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUnintialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth', passport.authenticate('google', {scope: ['openid']}));

app.get('/authFail', (req, res) => {
  res.send("Authentication failed.");
})

app.get('/siteSelect', passport.authenticate('google', { scope: ['openid'], successReturnToOrRedirect: '/siteSelect', failureRedirect: '/authFail' }), function (req, res) {
  res.redirect('/');
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
})

app.listen(3030, () => {
  console.log('Listening on localhost:3030')
})
