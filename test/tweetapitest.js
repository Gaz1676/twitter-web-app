
// We need a comparison that will test to see if the returnedUser
// Is a superset of the newUser object.
// It is here where we install lodash library
// Require is at the top of our test (const _ = require('lodash');)

'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');


suite('Tweet API tests', function () {

    let tweets = fixtures.tweets;
    let newTweet = fixtures.newTweet;

    const tweetService = new TweetService(fixtures.tweetService);

    // These are run before and after each test
    // Clearing our tweets model so that each test
    // can be considered completely independently.


    beforeEach(function () {
        tweetService.deleteAllTweets();
      });

    /*  afterEach(function () {
          tweetService.deleteAllTweets();
        });*/


    //=================Create Tweet
    test('create a tweet', function () {
        const returnedTweet = tweetService.createTweet(newTweet);
        assert(_.some([returnedTweet], newTweet), 'returnedTweet must be a superset of newTweet');
        assert.isDefined(returnedTweet._id);
      });

    //=================Get Tweet
    test('get tweet', function () {
        const t1 = tweetService.createTweet(newTweet);
        const t2 = tweetService.getTweet(t1._id);
        assert.deepEqual(t1, t2);
      });

    //=================Get Invalid Tweet
    test('get invalid tweet', function () {
        const t1 = tweetService.getTweet('1234');
        assert.isNull(t1);
        const t2 = tweetService.getTweet('012345678901234567890123');
        assert.isNull(t2);
      });

    //=================Delete Tweet
    test('delete a tweet', function () {
        const t = tweetService.createTweet(newTweet);
        assert(tweetService.getTweet(t._id) != null);
        tweetService.deleteOneTweet(t._id);
        assert(tweetService.getTweet(t._id) == null);
      });

    //=================Get All Users
    test('get all tweets', function () {
        for (let t of tweets) {
          tweetService.createTweet(t);
        }

        const allTweets = tweetService.getTweets();
        assert.equal(allTweets.length, tweets.length);
      });

    //=================Get Tweets Details
    test('get tweets detail', function () {
        for (let t of tweets) {
          tweetService.createTweet(t);
        }

        const allTweets = tweetService.getTweets();
        for (let i = 0; i < tweets.length; i++) {
          assert(_.some([allTweets[i]], tweets[i]), 'returnedTweet must be a superset of newTweet');
        }
      });

    //=================Get All Tweets Empty
    test('get all tweets empty', function () {
        const allTweets = tweetService.getTweets();
        assert.equal(allTweets.length, 0);
      });
  });
