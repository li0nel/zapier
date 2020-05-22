/* globals describe, it */
const sample = require('../samples/contact');
const nock = require('nock');
const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);
require('should');

const mockBaseURL = 'example.com';
const scope = nock(/example\.com/)
  .post('/api/Contact/PostContact')
  .reply(200, sample);

describe('creates', () => {
  describe('create contact create', () => {
    it('should create a new contact', done => {
      const bundle = {
        authData: {
          atreemoURL: mockBaseURL
        },
        inputData: {
          firstName: 'Leo',
          email: 'leo@gmail.com'
        }
      };

      appTester(App.creates.contact.operation.perform, bundle)
        .then(result => {
          result.should.have.property('CtcID');
          done();
        })
        .catch(done);
    });
  });
});
