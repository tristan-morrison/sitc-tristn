import express from "express";
import path from "path";

const router = express.Router();

router.use(express.static(path.join(__dirname, '.')));

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'));

});

router.get('/onsite', function (req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'));  
});

module.exports = router;