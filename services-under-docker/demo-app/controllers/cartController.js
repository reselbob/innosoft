var User = require('../models/cart');


exports.cart_get = async function cart_get(req, res) {
    var result = await User.findById(req.params.id).populate('user')
    res.send(result);
};

exports.cart_list = async function cart_list(req, res) {
    var result = await User.find({});
    res.send(result);
};

