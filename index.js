'use strict';

const Hapi = require('hapi');
let server = new Hapi.Server();


server.connection({
    port: process.env.PORT || 4000,
    routes: {

        // https://stackoverflow.com/questions/45627919/how-to-set-max-image-size-in-joi-hapi
        payload: {
            maxBytes: 1000 * 1000 * 5, // increases to 5mb
          },

        // validation: reports all errors and not just one
        // set in routes so it will be used across all files (DRY)
        validate: {

            options: {
                abortEarly: false,
              },
          },
      },
  });

// import of the db just created
require('./app/models/db');

// plugins registration
server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err => {

    if (err) {
      throw err;
    }

    // assign handlebars engine for views to the server
    server.views({
        engines: {
            hbs: require('handlebars'),
          },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layout',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false,
      });

    // cookie plugin
    server.auth.strategy('standard', 'cookie', {
        password: 'secretpasswordnotrevealedtoanyone',
        cookie: 'twitter-cookie',
        isSecure: false,
        ttl: 24 * 60 * 60 * 1000,
        redirectTo: '/login',
      });

    server.auth.default({
        strategy: 'standard',
      });

    server.route(require('./routes'));
    server.route(require('./routesapi'));

    server.start((err) => {
        if (err) {
          throw err;
        }

        console.log('Server listening at:', server.info.uri);
      });
  });
