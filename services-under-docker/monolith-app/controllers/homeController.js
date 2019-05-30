"use strict";
const meta = require('../meta');
const User = require('../models/user');
const Cart = require('../models/cart');
const ObjectId = require('mongoose').Types.ObjectId;

exports.home_getAll = async function home_getAll(req, res) {

    var result = await Cart.findOne({}).populate('user');
   
    meta.addMeta(result);
   
    res.render('index', result);
};