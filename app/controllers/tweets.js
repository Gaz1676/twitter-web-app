/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Tweet = require('../models/tweet');

// https://www.npmjs.com/package/dateformat
const DateFormat = require('dateformat');


// routes to render globaltweets page
exports.globalTweets = {
  handler: function (request, reply) {
    Tweet.find({}).populate('tweet').populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
      reply.view('globaltweets', {
        title: 'All Tweets To Date',
        tweets: allTweets,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};


// routes to render timeline page
exports.timeline = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let tweets = null;
    Tweet.find({ tweeter: userId }).populate('tweet').sort({ date: 'desc' }).then(allTweets => {
      tweets = allTweets;
      return User.findOne({ user: userId });
    }).then(userFound => {
      reply.view('timeline', {
        title: 'All Tweets To Date',
        tweets: tweets,
        user: userFound,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

// routes to render tweet page
exports.tweet = {
  handler: function (request, reply) {
    reply.view('tweet', {
      title: 'Make a Tweet',
    });
  },
};


// send a tweet
// error check validation done through Joi
// makes sure tweetbox is no empty
exports.sendTweet = {
  validate: {

    payload: {
      text: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      Tweet.find({}).then(tweets => {
        reply.view('tweet', {
          title: 'Invalid Tweet',
          tweets: tweets,
          errors: error.data.details,
        }).code(400);
      }).catch(err => {
        reply.redirect('/');
      });
    },
  },

  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    let tweet = request.payload;
    tweet.tweeter = userId;
    tweet.date = new Date();
    tweet.date = DateFormat(tweet.date, 'h:MM TT - dS mmm yy');
    Tweet.create(tweet).then(newTweet => {
      reply.redirect('/globaltweets');
    }).catch(err => {
      reply.redirect(err);
    });
  },
};


// user views other users tweet page
exports.viewOtherUser = {
  handler: function (request, reply) {
    const userId = request.params.id;
    Tweet.find({ tweeter: userId }).populate('tweeter').then(allTweets => {
      reply.view('viewotheruser', {
        title: 'Other Users Tweets',
        tweets: allTweets,
        user: userId,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};


// user remove a tweet
exports.userRemoveTweet = {
  handler: function (request, reply) {
    const tweets = Object.keys(request.payload);
    tweets.forEach(function (id) {
      Tweet.findByIdAndRemove(id, function (err) {
        if (err) throw err;
      });
    });
    reply.redirect('/timeline');
  },
};


// user remove all tweets
exports.userRemoveAllTweets = {
  handler: function (request, reply) {
    const userId = request.auth.credentials.loggedInUser;
    Tweet.remove({ tweeter: userId }).then(success => {
      reply.redirect('/timeline');
    }).catch(err => {
      reply.redirect(err);
    });
  },
};


// get images rendering to html in tweetlist
exports.getPicture = {
  handler: function (request, reply) {
    let tweetId = request.params.id;
    Tweet.findOne({ _id: tweetId }).exec((err, tweet) => {
      if (tweet.picture.data) {
        reply(tweet.picture.data).type('image');
      }
    });
  },
};
