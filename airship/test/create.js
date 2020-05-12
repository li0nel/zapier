/* globals describe, it */
require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('creates', () => {
  describe('create contact create', () => {
    it('should create a new contact', done => {
      const bundle = {
        authData: {
          soap_username: process.env.SOAP_USERNAME,
          soap_password: process.env.SOAP_PASSWORD,
        },
        inputData: {
          first_name: 'Lionel',
          email: 'lio@wi5.io',
          mobile_number: '07760502782',
          allow_email: 'N',
          group_id: 93264
        }
      };

      appTester(App.creates.contact.operation.perform, bundle)
        .then(result => {
          result.should.have.property('id');
          done();
        })
        .catch(done);
    });
  });
});
