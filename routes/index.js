const { application } = require('express');
var express = require('express');
var router = express.Router();
//For serving letter and softcopy files
router.use(express.static('uploads'))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

































































































// Developed By- Ayush Tamboli, Project Tranee, NIC(Mungeli), Mobile- 9039272267, Email- ayushtamboli2@gmail.com