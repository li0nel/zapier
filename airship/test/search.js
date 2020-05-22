/* global describe, it, before */
require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const fs = require('fs');
const nock = require('nock');
const path = require('path');

const sample_searched_existing_contact = fs.readFileSync(path.resolve(__dirname, '../samples/search_existing_contact.xml'), 'utf-8');
const sample_searched_non_existing_contact = fs.readFileSync(path.resolve(__dirname, '../samples/search_non_existing_contact.xml'), 'utf-8');

process.env.AIRSHIP_PROTOCOL = 'https';
process.env.AIRSHIP_DOMAIN = 'example.com'

describe('search contact', () => {
  it('search an existing contact', () => {
    const bundle = {
      authData: {
        soap_username: 'dummy',
        soap_password: 'dummy',
      },
      inputData: {
        email: 'lionel@wi5.io'
      }
    };

    const scope = nock(/example\.com/)
    .post('/SOAP/V3/Contact.php')
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/getContactEmail')
    .reply(200, sample_searched_existing_contact);

    return appTester(App.searches.contact.operation.perform, bundle).then(
      contacts => {
        contacts.should.be.instanceof(Array)
        contacts.length.should.be.exactly(1)
        contacts[0].should.have.ownProperty('id')
      }
    );
  });

  it('search a non-existing contact', () => {
    const bundle = {
      authData: {
        soap_username: 'dummy',
        soap_password: 'dummy',
      },
      inputData: {
        email: 'kanye@wi5.io'
      }
    };

    const scope = nock(/example\.com/)
    .post('/SOAP/V3/Contact.php')
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/getContactEmail')
    .reply(200, sample_searched_non_existing_contact);

    return appTester(App.searches.contact.operation.perform, bundle).then(
      contacts => {
        contacts.should.be.instanceof(Array)
        contacts.should.be.empty()
      }
    );
  });
});
