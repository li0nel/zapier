/* global describe, it, before */
require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('get hubspot metrics', () => {
  it('gets hubspot metrics', (done) => {
    const bundle = {
      authData: {
        apiKey: process.env.HUBSPOT_API_KEY
      }
    };

    return appTester(App.searches.hsmetrics.operation.perform, bundle).then(
      metrics => {
        metrics[0].should.have.ownProperty('leads');
        metrics[0].leads.should.have.ownProperty('locations');
        done();
      }
    ).catch(done);
  });
});
