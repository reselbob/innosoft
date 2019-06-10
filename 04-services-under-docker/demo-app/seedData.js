"use strict";

const User = require('./models/user');
const Cart = require('./models/cart');

exports.seed_data = async () => {

    var user= await User.findOne({});
    if(!user){
        user = new User({name: 'bob'});
        await user.save();
    }

    console.log(user);

    var cart = await Cart.findOne({user: user.id});
    if(!cart){
        cart = new Cart({ items: ['orange','apple','banana'], user: user.id });
        await cart.save();
    }
    console.log(cart);
}