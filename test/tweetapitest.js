'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Tweet API tests', function () {

  let tweets = fixtures.tweets;
  let newTweet = fixtures.newTweet;

  const tweetService = new TweetService(fixtures.tweetService);

  beforeEach(function () {
    tweetService.deleteAllTweets();
  });

  afterEach(function () {
    tweetService.deleteAllTweets();
  });

  test('create a tweet', function () {
    const returnedTweet = tweetService.createTweet(newTweet);
    assert(_.some([returnedTweet], newTweet), 'returnedTweet must be a superset of newTweet');
    assert.isDefined(returnedTweet._id);
  });

  test('get tweet', function () {
    const t1 = tweetService.createTweet(newTweet);
    const t2 = tweetService.getTweet(t1._id);
    assert.deepEqual(t1, t2);
  });

  test('get tweets detail', function () {
    for (let t of tweets) {
      tweetService.createTweet(t);
    }

    const allTweets = tweetService.getTweets();
    for (let i = 0; i < tweets.length; i++) {
      assert(_.some([allTweets[i]], tweets[i]), 'returnedTweet must be a superset of newTweet');
    }
  });

  test('get invalid tweet', function () {
    const t1 = tweetService.getTweet('1234');
    assert.isNull(t1);
    const t2 = tweetService.getTweet('012345678901234567890123');
    assert.isNull(t2);
  });

  test('get all tweets', function () {
    for (let t of tweets) {
      tweetService.createTweet(t);
    }

    const allTweets = tweetService.getTweets();
    assert.equal(allTweets.length, tweets.length);
  });

  test('delete a tweet', function () {
    const t = tweetService.createTweet(newTweet);
    assert(tweetService.getTweet(t._id) != null);
    tweetService.deleteOneTweet(t._id);
    assert(tweetService.getTweet(t._id) == null);
  });

  test('get all tweets empty', function () {
    const allTweets = tweetService.getTweets();
    assert.equal(allTweets.length, 0);
  });
});
