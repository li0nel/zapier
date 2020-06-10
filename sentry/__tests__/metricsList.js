/* globals describe, it, expect */
require('should');
const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('list Sentry metrics', () => {
  it('fetches Sentry metrics', async () => {
    const bundle = {
      authData: {
        access_token: process.env.SENTRY_ACCESS_TOKEN
      },
    };
    
    return appTester(App.searches.metrics.operation.perform, bundle).then(
      metrics => {
        metrics.should.be.an.Array()
        metrics[0].should.have.ownProperty('nb_unresolved_issues')
      }
    );
  });
});
