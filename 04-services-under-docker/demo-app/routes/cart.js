var express = require('express');
var router = express.Router();
var controller = require('../controllers/cartController');

/* GET users listing. */
router.get('/:id', controller.cart_get);

router.get('/', controller.cart_list);

module.exports = router;