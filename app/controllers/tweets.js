/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Tweet = require('../models/tweet');
const DateFormat = require('dateformat');

// routes to render globaltweets page
exports.globalTweets = {
    handler: function (request, reply) {
        Tweet.find({}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
            reply.view('globaltweets', {
                title: 'All Tweets To Date',
                tweets: allTweets,
              });
            console.log(`>> Global Timeline`);
          }).catch(err => {
            console.log(err);
            reply.redirect('/');
          });
      },
  };

// routes to render timeline page
exports.timeline = {
    handler: function (request, reply) {
        const loggedInUser = request.auth.credentials.loggedInUser;

        User.findOne({ email: loggedInUser }).then(user => {
            Tweet.find({ tweeter: user.id }).populate('tweet').sort({ date: 'desc' }).then(myTweets => {
                reply.view('timeline', {
                    title: 'My Tweets To Date',
                    tweets: myTweets,
                    user: user,

                  });
                console.log(`>> ` + user.email + `'s Timeline`);
              }).catch(err => {
                console.log(err);
                reply.redirect('/');
              });
          });
      },
  };

// routes to render tweet page
exports.tweet = {
    handler: function (request, reply) {
        reply.view('tweet', {
            title: 'Make a Tweet',

          });
        console.log(`>> Sending a Tweet page`);
      },
  };

// send a tweet
// error check validation done through Joi
// makes sure tweetbox is no empty
// Joi.any() that matches any data type
exports.sendTweet = {
    validate: {

        payload: {
            text: Joi.string().required(),
            picture: Joi.any().required(),
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
        const loggedInUser = request.auth.credentials.loggedInUser;
        let tweet = request.payload;
        let data = request.payload;

        User.findOne({ email: loggedInUser }).then(user => {

            tweet.date = new Date();
            tweet.date = DateFormat(tweet.date, 'h:MM TT - dS mmm yy');

            tweet.tweeter = user.id;
            if ((data.text !== '') || (data.picture.buffer)) {
              const tweet = new Tweet(data);
              if (data.picture.length) {
                tweet.picture.data = data.picture;
                tweet.picture.contentType = String;
              }

              return tweet.save();
            }
          }).then(newTweet => {
            console.log(`>> Tweet sent by: ` + loggedInUser);
            reply.redirect('/globaltweets');
          }).catch(err => {
            console.log(err);
            reply.redirect('/timeline');
          });
      },
  };

// user views other users tweet page
exports.viewOtherUser = {
    handler: function (request, reply) {
        const userId = request.params.id;

        User.findOne({ _id: userId }).then(user => {
            Tweet.find({ tweeter: userId }).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
                reply.view('viewotheruser', {
                    title: 'Users Tweets',
                    tweets: allTweets,
                    user: user,
                    id: userId,
                  });
              });
          }).catch(err => {
            console.log(err);
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
        console.log(`>> Tweet removed`);
        reply.redirect('/timeline');
      },
  };


// user remove all tweets
exports.userRemoveAllTweets = {
    handler: function (request, reply) {
        const loggedInUser = request.auth.credentials.loggedInUser;
        User.findOne({ email: loggedInUser }).then(currentUser => {
            Tweet.remove({ tweeter: currentUser.id }).then(success => {
                console.log(`>> Removed all Tweets`);
                reply.redirect('/timeline');
              }).catch(err => {
                console.log(err);
                reply.redirect('/');
              });
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

// follow a user
exports.follow = {
    handler: function (request, reply) {
        let loggedInUser = request.auth.credentials.loggedInUser;
        let userId = request.params.id;

        User.findOne({ email: loggedInUser }).then(currentUser => {
            User.findOne({ _id: userId }).then(foundUser => {
                currentUser.following.push(foundUser._id);
                foundUser.followers.push(currentUser._id);
                currentUser.save();
                foundUser.save();
                console.log('>> Following: ' + foundUser.email);
                reply.redirect('/viewotheruser/' + userId);
              });
          }).catch(err => {
            console.log(err + ` >> Error when trying to follow User`);
            reply.redirect('/');
          });
      },
  };

// unfollow a user
exports.unfollow = {
    handler: function (request, reply) {
        let loggedInUser = request.auth.credentials.loggedInUser;
        const userId = request.params.id;

        User.findOne({ email: loggedInUser }).then(currentUser => {
            User.findOne({ _id: userId }).then(foundUser => {
                currentUser.following.splice(foundUser._id, 1);
                foundUser.followers.splice(currentUser._id, 1);
                currentUser.save();
                foundUser.save();
                console.log('>> Unfollowed: ' + foundUser.email);
                reply.redirect('/viewotheruser/' + userId);
              });
          }).catch(err => {
            console.log(err + `Error when trying to Unfollow User`);
            reply.redirect('/');
          });
      },
  };
