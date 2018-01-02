/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Date: Jan 7th 2018
 */

'use strict';

const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    picture: { data: Buffer, contentType: String },
    isFollowed: Boolean,
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
