/* globals describe, it */
require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('list', () => {
  describe('list groups', () => {
    it('should list groups for unit', done => {
      const bundle = {
        authData: {
          soap_username: process.env.SOAP_USERNAME,
          soap_password: process.env.SOAP_PASSWORD,
        },
        inputData: {
          unit_id: 3766
        }
      };

      appTester(App.triggers.group.operation.perform, bundle)
        .then(result => {
          // result.should.have.property('id');
          done();
        })
        .catch(done);
    });
  });
});
