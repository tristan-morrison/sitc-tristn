"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.use(_express.default.static(_path.default.join(__dirname, '.')));
router.get('/', function (req, res, next) {
  res.sendFile(_path.default.join(__dirname, './index.html'));
});
router.get('/onsite', function (req, res, next) {
  res.sendFile(_path.default.join(__dirname, './index.html'));
});
module.exports = router;