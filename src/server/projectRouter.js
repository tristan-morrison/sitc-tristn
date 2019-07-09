import express from "express";
import path from "path";

const router = express.Router();

//...

// Our app.use in the last file forwards a request to our albums router.
// So this route actually handles `/albums` because it's the root route when a request to /albums is forwarded to our router.
router.use(express.static(path.join(__dirname, '.')));

router.get('/', function (req, res, next) {
    // res.send() our response here
  res.sendFile(path.join(__dirname, './index.html'));

});


// A route to handle requests to any individual album, identified by an album id
router.get('/onsite', function (req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'));  
});



//...

module.exports = router;