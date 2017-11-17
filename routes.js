/**
 * Author: Gary Fleming
 * Student No: 20019497
 * Start Date: Oct 10th 2017
 */

const Accounts = require('./app/controllers/accounts');
const Tweets = require('./app/controllers/tweets');
const Assets = require('./app/controllers/assets');
const Admins = require('./app/controllers/admins');

module.exports = [

  // Accounts Routes
  { method: 'GET', path: '/', config: Accounts.main },
  { method: 'GET', path: '/signup', config: Accounts.signup },
  { method: 'GET', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/login', config: Accounts.authenticate },
  { method: 'POST', path: '/register', config: Accounts.register },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'GET', path: '/about', config: Accounts.about },
  { method: 'GET', path: '/settings', config: Accounts.viewSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },

  // Tweet Routes
  { method: 'GET', path: '/tweet', config: Tweets.tweet },
  { method: 'GET', path: '/timeline', config: Tweets.timeline },
  { method: 'POST', path: '/sendtweet', config: Tweets.sendTweet },
  { method: 'GET', path: '/viewotheruser/{id}', config: Tweets.viewOtherUser },
  { method: 'POST', path: '/userremovetweet', config: Tweets.userRemoveTweet },
  { method: 'POST', path: '/userremovealltweets', config: Tweets.userRemoveAllTweets },
  { method: 'GET', path: '/globaltweets', config: Tweets.globalTweets },

  // Admin Routes
  { method: 'GET', path: '/adminhome', config: Admins.adminHome },
  { method: 'GET', path: '/createuser', config: Admins.createUser },
  { method: 'POST', path: '/registeruser', config: Admins.registerUser },
  { method: 'GET', path: '/adminviewuser/{id}', config: Admins.adminViewUser },
  { method: 'GET', path: '/removeuser/{id}', config: Admins.removeUser },
  { method: 'POST', path: '/adminremovetweet', config: Admins.adminRemoveTweet },
  { method: 'POST', path: '/adminremovealltweets', config: Admins.adminRemoveAllTweets },


  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },
];
