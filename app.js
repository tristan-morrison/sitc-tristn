"use strict";

var _express = _interopRequireDefault(require("express"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _path = _interopRequireDefault(require("path"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _sessionFileStore = _interopRequireDefault(require("session-file-store"));

var _passport = _interopRequireDefault(require("passport"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _util = _interopRequireDefault(require("util"));

var _winston = _interopRequireDefault(require("winston"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

_winston.default.level = 'debug';

var logger = _winston.default.createLogger({
  colorize: true,
  transports: [new _winston.default.transports.Console({
    format: _winston.default.format.combine(_winston.default.format.colorize(), _winston.default.format.simple()),
    colorize: true
  })]
});

var app = (0, _express.default)();
var GoogleStrategy = _passportGoogleOauth.default.OAuth2Strategy;
var FileStore = (0, _sessionFileStore.default)(_expressSession.default);

_passport.default.use(new GoogleStrategy({
  clientID: _constants.OAUTH.CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_SECRET,
  callbackURL: process.env.DOMAIN
}, function (accessToken, refreshToken, profile, done) {
  logger.info("profile.id: " + _util.default.inspect(profile));
  return done(null, {
    username: 'tristan@summerinthecity.com',
    password: 'dfkjsldjl',
    id: profile.id
  }); //, {message: 'Invalid credentials\n'}
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
}));

_passport.default.serializeUser(function (user, done) {
  done(null, user.id);
});

_passport.default.deserializeUser(function (id, done) {
  done(null, {
    username: 'tristan@summerinthecity.com',
    password: 'dfkjsldjl',
    id: id
  });
});

var cookieExpirationDate = new Date();
var cookieExpirationDays = 3;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);
app.use((0, _cookieParser.default)(process.env.SESSION_SECRET));
app.use((0, _bodyParser.default)());
app.use((0, _expressSession.default)({
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
app.use(_passport.default.initialize());
app.use(_passport.default.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // req.user is available for use here
    logger.info(_util.default.inspect(req));
    return next();
  } // denied. redirect to login


  res.redirect("/auth");
}

app.get('/auth/success', _passport.default.authenticate('google', {
  scope: ['openid'],
  failureRedirect: '/authFail'
}), function (req, res) {
  logger.info(_util.default.inspect(req.session));
  res.redirect("/siteSelect");
});
app.get('/authFail', function (req, res) {
  res.send("Authentication failed.");
});
app.get('/auth', _passport.default.authenticate('google', {
  scope: ['openid']
}));
app.get('/siteSelect', ensureAuthenticated, function (req, res) {
  res.sendFile(_path.default.join(__dirname, './index.html'));
});
app.get('/aProtectedRoute', ensureAuthenticated, function (req, res) {
  res.send("YOU ARE AUTHENTICATED. CONGRATS.");
});
app.get('/', ensureAuthenticated, function (req, res) {
  res.sendFile(_path.default.join(__dirname, './index.html'));
});
app.use(_express.default.static(_path.default.join(__dirname, './')));
app.listen(3030, function () {
  console.log('Listening on localhost:3030');
});