var User = require('../models/user');

async function user_list(req, res) {
    var result = await User.find();
    res.send(result);

}
exports.user_list = user_list;

async function user_get(req, res) {
    var result = await User.findById(req.params.id);
    res.send(result);

}
exports.user_get = user_get;