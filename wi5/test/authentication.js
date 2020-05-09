/* global describe, it, before */

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

process.env.AUTH0_CLIENT_ID='1234'
process.env.AUTH0_CLIENT_SECRET='asdf'
process.env.AUTH0_DOMAIN='auth-json-server.zapier-staging.com'
process.env.OAUTH_TOKEN_URL='/oauth/access-token'
process.env.OAUTH_CONTENT_TYPE='application/x-www-form-urlencoded'
process.env.OAUTH_REFRESH_TOKEN_URL='/oauth/refresh-token'
process.env.OAUTH_USER_PROFILE_URL='/me'

describe('oauth2 app', () => {
  it('generates an authorize URL', () => {
    const bundle = {
      // In production, these will be generated by Zapier and set automatically
      inputData: {
        state: '4444',
        redirect_uri: 'https://zapier.com/'
      },
      environment: {
        // These will come from your local environment. When running in production, Zapier builds a bundle
        // that includes environment variables you have set with `zapier env` command.
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
      }
    };

    return appTester(App.authentication.oauth2Config.authorizeUrl, bundle).then(
      authorizeUrl => {
        authorizeUrl.should.eql(
          `https://${process.env.AUTH0_DOMAIN}/authorize?client_id=${process.env.AUTH0_CLIENT_ID}&client_secret=${process.env.AUTH0_CLIENT_SECRET}&state=4444&redirect_uri=https%3A%2F%2Fzapier.com%2F&response_type=code&scope=openid%20email%20offline_access&audience=https%3A%2F%2Forder.staging.wi5.io`
        );
      }
    );
  });

  it('can fetch an access token', () => {
    const bundle = {
      inputData: {
        // In production, Zapier passes along whatever code your API set in the query params when it redirects
        // the user's browser to the `redirect_uri`
        code: 'one_time_code',
        redirect_uri: 'https://zapier.com/'
      },
      cleanedRequest: {
        querystring: {
          code: 'one_time_code'
        }
      },
      rawRequest: {
        querystring: '?code=one_time_code'
      }
    };
    
    return appTester(
      App.authentication.oauth2Config.getAccessToken,
      bundle
    ).then(result => {
      result.access_token.should.eql('a_token');
      result.refresh_token.should.eql('a_refresh_token');
    });
  });

  it('can refresh the access token', () => {
    const bundle = {
      // In production, Zapier provides these. For testing, we have hard-coded them.
      // When writing tests for your own app, you should consider exporting them and doing process.env.MY_ACCESS_TOKEN
      authData: {
        access_token: 'a_token',
        refresh_token: 'a_refresh_token'
      },
      environment: {
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
      }
    };

    return appTester(
      App.authentication.oauth2Config.refreshAccessToken,
      bundle
    ).then(result => {
      result.access_token.should.eql('a_new_token');
    });
  });

  it('includes the access token in future requests', () => {
    const bundle = {
      authData: {
        access_token: 'a_token',
        refresh_token: 'a_refresh_token'
      }
    };

    return appTester(App.authentication.test, bundle).then(result => {
      result.should.have.property('username');
      result.username.should.eql('Bret');
    });
  });
});
