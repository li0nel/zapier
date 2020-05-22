/* global describe, it, before */
require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const fs = require('fs');
const nock = require('nock');
const path = require('path');

const sample_created_contact = fs.readFileSync(path.resolve(__dirname, '../samples/created_contact.xml'), 'utf-8');
const sample_get_contact = fs.readFileSync(path.resolve(__dirname, '../samples/get_contact.xml'), 'utf-8');

process.env.AIRSHIP_PROTOCOL = 'https';
process.env.AIRSHIP_DOMAIN = 'example.com'

describe('create contact', () => {
  it('create a contact', () => {
    const bundle = {
      authData: {
        soap_username: 'dummy',
        soap_password: 'dummy',
        source_id: 1234
      },
      inputData: {
        first_name: 'Kanye',
        email: 'kanye@wi5.io',
        mobile_number: '07760502783',
        allow_email: 'N',
        group_id: 1234
      }
    };

    let scope = nock(/example\.com/)
    .post('/SOAP/V3/Contact.php')
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/getContactEmail')
    .reply(200, sample_get_contact);

    scope = nock(/example\.com/)
    .post('/SOAP/V3/Contact.php')
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/createContact')
    .reply(200, sample_created_contact);

    return appTester(App.creates.contact.operation.perform, bundle).then(
      contact => {
        contact.should.have.ownProperty('id');
      }
    );
  });
});
