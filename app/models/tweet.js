/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Date: Jan 7th 2018
 */

'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');


// https://hashnode.com/post/how-to-store-image-into-mongodb-using-nodejs-ciywexzlx000117539emkvcck
const tweetSchema = mongoose.Schema({
    text: String,
    date: String,
    picture: { data: Buffer, contentType: String },
    tweeter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
  });

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
