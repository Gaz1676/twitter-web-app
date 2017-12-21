/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let dbURI = 'mongodb://twitteruser:twitteruser@ds113925.mlab.com:13925/twitter';

//let dbURI = 'mongodb://localhost:12345/tweet';

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
  });

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
  });

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
  });


//Pre-load/Seed database on startup from data.json
/*mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
  if (process.env.NODE_ENV !== 'production') {
    let seeder = require('mongoose-seeder');
    const data = require('./data.json');
    const Tweet = require('./tweet');
    const User = require('./user');
    const Admin = require('./admin');
    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('preloading Test Data');
      console.log(dbData);
    }).catch(err => {
      console.log(error);
    });
  }
});*/
