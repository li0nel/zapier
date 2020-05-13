/* globals describe, it */
require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('searches', () => {
  describe('search contact ', () => {
    it('should return a contact', done => {
      const bundle = {
        authData: {
          soap_username: process.env.SOAP_USERNAME,
          soap_password: process.env.SOAP_PASSWORD,
        },
        inputData: {
          email: 'lionel@wi5.io'
        }
      };

      appTester(App.searches.contact.operation.perform, bundle)
        .then(result => {
          result[0].should.have.property('id');
          done();
        })
        .catch(done);
    });

    it('should return emtpy results for unknown contact', done => {
      const bundle = {
        authData: {
          soap_username: process.env.SOAP_USERNAME,
          soap_password: process.env.SOAP_PASSWORD,
        },
        inputData: {
          email: 'paris.hilton@wi5.io'
        }
      };

      appTester(App.searches.contact.operation.perform, bundle)
        .then(result => {
          result.should.be.empty();
          done();
        })
        .catch(done);
    });
  });
});
