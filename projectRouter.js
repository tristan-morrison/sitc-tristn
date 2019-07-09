"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router(); //...
// Our app.use in the last file forwards a request to our albums router.
// So this route actually handles `/albums` because it's the root route when a request to /albums is forwarded to our router.


router.use(_express.default.static(_path.default.join(__dirname, '.')));
router.get('/', function (req, res, next) {
  // res.send() our response here
  res.sendFile(_path.default.join(__dirname, './index.html'));
}); // A route to handle requests to any individual album, identified by an album id

router.get('/onsite', function (req, res, next) {
  res.sendFile(_path.default.join(__dirname, './index.html'));
}); //...

module.exports = router;