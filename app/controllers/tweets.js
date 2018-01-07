/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Date: Jan 7th 2018
 */

'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Tweet = require('../models/tweet');
const DateFormat = require('dateformat');

// routes to render globaltweets page
exports.globalTweets = {
    handler: function (request, reply) {
        let follow;

        User.find({}).populate('user').then(allUsers => {
            Tweet.find({}).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
                reply.view('globaltweets', {
                    title: 'All Tweets To Date',
                    tweets: allTweets,
                    users: allUsers,
                    follow: follow,
                  });
                console.log(`>> Global Timeline`);
              }).catch(err => {
                console.log(err);
                reply.redirect('/');
              });
          });
      },
  };


// users personal tweet timeline
exports.timeline = {
    handler: function (request, reply) {
        const loggedInUser = request.auth.credentials.loggedInUser;
        let userStats = {};

        User.findOne({ email: loggedInUser }).populate('following').then(user => {
            const userId = user.id;

            Tweet.count({ tweeter: userId }, function (err, tweets) {
                userStats.posts = tweets;
              });

            Tweet.find({ tweeter: user.id }).populate('tweet').sort({ date: 'desc' }).then(myTweets => {
                reply.view('timeline', {
                    title: 'My Tweets To Date',
                    tweets: myTweets,
                    user: user,
                    userStats: userStats,
                  });
                console.log(`>> ` + user.email + `'s Timeline`);
              }).catch(err => {
                console.log(err);
                reply.redirect('/');
              });
          });
      },
  };


// routes to render view settings page
exports.viewSettings = {
    handler: function (request, reply) {
        let loggedInUser = request.auth.credentials.loggedInUser;

        User.findOne({ email: loggedInUser }).then(user => {
            reply.view('settings', {
                title: 'Edit Account Settings',
                user: user,
              });
          }).catch(err => {
            console.log(err);
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
            text: Joi.string().min(1).max(140).required(),
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
        let tweetData = request.payload;

        User.findOne({ email: loggedInUser }).then(user => {

            // setting date format from payload
            tweetData.date = new Date();
            tweetData.date = DateFormat(tweetData.date, 'mmm dS yyyy, H:mm:ss TT');

            // setting image for tweet
            tweetData.tweeter = user.id;
            if ((tweetData.text !== '') || (data.picture.buffer)) {
              const tweet = new Tweet(tweetData);
              if (tweetData.picture.length) {
                tweet.picture.data = tweetData.picture;
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
        let following = false;
        let userStats = {};

        User.findOne({ _id: userId }).then(user => {
            const userId = user.id;

            // https://docs.mongodb.com/manual/reference/method/cursor.count/index.html
            Tweet.count({ tweeter: userId }, function (err, tweets) {
                userStats.posts = tweets;
              });

            // https://docs.mongodb.com/manual/reference/operator/aggregation/ne/index.html
            User.find({ _id: userId }).then(followedUser => {
                Tweet.find({ tweeter: userId }).populate('tweeter').sort({ date: 'desc' }).then(allTweets => {
                    if (followedUser.length > 0) {
                      following = true;
                    }

                    reply.view('viewotheruser', {
                        title: 'Users Tweets',
                        tweets: allTweets,
                        user: user,
                        id: userId,
                        userStats: userStats,
                        following: following,
                        followedUser: followedUser,
                      });
                  });
              });
          }).catch(err => {
            console.log(err);
            reply.redirect('/search');
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

        Tweet.findOne({ _id: tweetId }).then(tweet => {
            reply(tweet.picture.data).type('image');
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
                foundUser.isFollowed = true;
                currentUser.save();
                foundUser.save();
                console.log('>> Following: ' + foundUser.email);
                reply.redirect('/globaltweets');
              });
          }).catch(err => {
            console.log(err + `>> Error when trying to follow User`);
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
                foundUser.isFollowed = false;
                currentUser.save();
                foundUser.save();
                console.log('>> Unfollowed: ' + foundUser.email);
                reply.redirect('/search');
              });
          }).catch(err => {
            console.log(err + `Error when trying to unfollow User`);
            reply.redirect('/');
          });
      },
  };
