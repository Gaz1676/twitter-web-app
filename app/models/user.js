/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

'use strict';

const mongoose = require('mongoose');

// Module to represent a Schema for a User model

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    picture: { data: Buffer, contentType: String },
    followers: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
