var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController');

/* GET users listing. */
router.get('/:id',controller.user_get);

router.get('/', controller.user_list);

module.exports = router;