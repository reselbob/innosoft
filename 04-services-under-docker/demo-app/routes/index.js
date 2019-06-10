var express = require('express');
var router = express.Router();
const home_controller = require('../controllers/homeController');
/* GET home page. */
router.get('/', home_controller.home_getAll);

module.exports = router;