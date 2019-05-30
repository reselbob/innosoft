"use strict";
const meta = require('../meta');

var request = require('request-promise');

const CART_URL = process.env.CART_URL || 'http://localhost:3001/cart';
const USER_URL = process.env.USER_URL || 'http://localhost:3002/user';

exports.home_getAll = async function home_getAll(req, res) {

    var response;

    response = await request(CART_URL);

    const cart = JSON.parse(response)[0];

    response = await request(USER_URL);

    const user = JSON.parse(response)[0];

    var result = cart;
    result.user = user;

    meta.addMeta(result);

    res.render('index', result);
};