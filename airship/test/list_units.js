/* globals describe, it */
require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('list', () => {
  describe('list units', () => {
    it('should list units', done => {
      const bundle = {
        authData: {
          soap_username: process.env.SOAP_USERNAME,
          soap_password: process.env.SOAP_PASSWORD,
        }
      };

      appTester(App.triggers.unit.operation.perform, bundle)
        .then(result => {
          result.should.not.be.empty();
          done();
        })
        .catch(done);
    });
  });
});
