// We need a comparison that will test to see if the returnedUser
// Is a superset of the newUser object.
// It is here where we install lodash library
// Require is at the top of our test (const _ = require('lodash');)

'use strict';

const assert = require('chai').assert;
const TweetService = require('./tweet-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('User API tests', function () {

    let users = fixtures.users;
    let newUser = fixtures.newUser;

    const tweetService = new TweetService(fixtures.tweetService);

    // These are run before and after each test
    // Clearing our users model so that each test
    // can be considered completely independently.

    beforeEach(function () {
        tweetService.deleteAllUsers();
      });

    /*afterEach(function () {
        tweetService.deleteAllUsers();
    });*/

    //=================Create User
    test('create a user', function () {
        const returnedUser = tweetService.createUser(newUser);
        assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
        assert.isDefined(returnedUser._id);
      });

    //=================Get User
    test('get user', function () {
        const u1 = tweetService.createUser(newUser);
        const u2 = tweetService.getUser(u1._id);
        assert.deepEqual(u1, u2);
      });

    //=================Get Invalid User
    test('get invalid user', function () {
        const u1 = tweetService.getUser('1234');
        assert.isNull(u1);
        const u2 = tweetService.getUser('012345678901234567890123');
        assert.isNull(u2);
      });

    //=================Delete User
    test('delete a user', function () {
        const u = tweetService.createUser(newUser);
        assert(tweetService.getUser(u._id) != null);
        tweetService.deleteOneUser(u._id);
        assert(tweetService.getUser(u._id) == null);
      });

    //=================Get All Users
    test('get all users', function () {
        for (let c of users) {
          tweetService.createUser(c);
        }

        const allUsers = tweetService.getUsers();
        assert.equal(allUsers.length, users.length);
      });

    //=================Get Users Details
    test('get users detail', function () {
        for (let c of users) {
          tweetService.createUser(c);
        }

        const allUsers = tweetService.getUsers();
        for (let i = 0; i < users.length; i++) {
          assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
        }
      });

    //=================Get All Users Empty
    test('get all users empty', function () {
        const allUsers = tweetService.getUsers();
        assert.equal(allUsers.length, 0);
      });

  });
