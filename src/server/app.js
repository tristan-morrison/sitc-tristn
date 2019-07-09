import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import passport from 'passport';
import googleOAuth from 'passport-google-oauth';
import dotenv from 'dotenv';
import uuid from 'uuid/v4';
import util from 'util';
import winston from 'winston';

import projectRouter from "./projectRouter";

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

passport.use(new GoogleStrategy({
    clientID: OAUTH.CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: process.env.DOMAIN,
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info("profile.id: " + util.inspect(profile));
    return done(null, { username: 'tristan@summerinthecity.com', password: 'dfkjsldjl', id: profile.id }); //, {message: 'Invalid credentials\n'}
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { username: 'tristan@summerinthecity.com', password: 'dfkjsldjl', id: id });
})

const cookieExpirationDate = new Date();
const cookieExpirationDays = 3;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser());
app.use(session({
  // genid: (req) => {
  //   return uuid();
  // },
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: cookieExpirationDate
  }
}));
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    return next();
  }

  // denied. redirect to login
  res.redirect("/auth");
}

app.use("/project", projectRouter);

app.get('/auth/success', passport.authenticate('google', { scope: ['openid'], failureRedirect: '/authFail' }), function (req, res) {
  logger.info(util.inspect(req.session));
  res.redirect("/siteSelect");
})

app.get('/authFail', (req, res) => {
  res.send("Authentication failed.");
})

app.get('/auth', passport.authenticate('google', { scope: ['openid'] }));

app.get('/siteSelect', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
})

app.get('/hello', (req, res) => {
  logger.info("matched the hello route!");
  res.send("Hello, World!");
})

app.get('/aProtectedRoute', ensureAuthenticated, (req, res) => {
  res.send("YOU ARE AUTHENTICATED. CONGRATS.")
})

// app.get("/project", ensureAuthenticated, (req, res) => {
//   logger.info("matched the default route!");
//   logger.info(req.path);
//   res.sendFile(path.join(__dirname, './index.html'));
// })

// app.get("/project/onsite", ensureAuthenticated, (req, res) => {
//   logger.info("matched the default route!");
//   logger.info(req.path);
//   res.sendFile(path.join(__dirname, './index.html'));
// })

app.get("/checkedin", ensureAuthenticated, (req, res) => {
  logger.info("matched the default route!");
  logger.info(req.path);
  res.sendFile(path.join(__dirname, './index.html'));
})

app.get("/", ensureAuthenticated, (req, res) => {
  logger.info("matched the default route!");
  logger.info(req.path);
  res.sendFile(path.join(__dirname, './index.html'));
})

app.use(express.static(path.join(__dirname, '.')));

app.listen(3030, () => {
  console.log('Listening on localhost:3030')
})
