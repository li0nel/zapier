/* global describe, it, before */
require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const fs = require('fs');
const nock = require('nock');
const path = require('path');

const sample_getSystemUsers = fs.readFileSync(path.resolve(__dirname, '../samples/get_system_users.xml'), 'utf-8');

process.env.AIRSHIP_PROTOCOL = 'https';
process.env.AIRSHIP_DOMAIN = 'example.com'

describe('authentication', () => {
  it('can login using SOAP username and password', () => {
    const bundle = {
      // In production, these will be generated by Zapier and set automatically
      authData: {
        soap_username: 'dummy',
        soap_password: 'dummy'
      }
    };

    const scope = nock(/example\.com/)
    .post('/SOAP/V3/Admin.php')
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/getSystemUsers')
    .reply(200, sample_getSystemUsers);

    return appTester(App.authentication.test, bundle).then(
      user => {
        user.should.have.ownProperty('email');
      }
    );
  });
});