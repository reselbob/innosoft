"use strict";

const Cart = require('./models/cart');
var mongoose = require('mongoose');

exports.seed_data = async () => {
    var cart = await Cart.findOne({user: mongoose.Types.ObjectId("5b6dd2f9a377161ff5add1f1")});
    if(!cart){
        cart = new Cart({ items: ['orange','apple','banana'], user: mongoose.Types.ObjectId("5b6dd2f9a377161ff5add1f1") });
        await cart.save();
    }
    console.log(cart);
}