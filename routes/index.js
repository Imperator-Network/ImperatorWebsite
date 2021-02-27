var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  api.getServerDetails().then((server) => res.render('index', { data: server }));
});

module.exports = router;
