"use strict";

const User = require('./models/user');

var mongoose = require('mongoose');

exports.seed_data = async () => {
    var user= await User.findOne({});
    if(!user){
        user = new User({_id: mongoose.Types.ObjectId("5b6dd2f9a377161ff5add1f1"), name: 'bob'});
        await user.save();
    }

    console.log(user);
 }