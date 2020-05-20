/* global describe, it, before */
require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const fs = require('fs');
const nock = require('nock');
const path = require('path');

const sample_groups_1 = fs.readFileSync(path.resolve(__dirname, '../samples/groups_1.xml'), 'utf-8');
const sample_groups_2 = fs.readFileSync(path.resolve(__dirname, '../samples/groups_2.xml'), 'utf-8');

process.env.AIRSHIP_PROTOCOL = 'https';
process.env.AIRSHIP_DOMAIN = 'example.com'

describe('list groups', () => {
  it('list groups for an empty unit', () => {
    const bundle = {
      authData: {
        soap_username: 'dummy',
        soap_password: 'dummy',
      },
      inputData: {
        unit_id: 123
      }
    };

    const scope = nock(/example\.com/)
    .post('/SOAP/V3/Stat.php')
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/groupList')
    .reply(200, sample_groups_1);

    return appTester(App.triggers.group.operation.perform, bundle).then(
      groups => {
        groups.should.be.instanceof(Array)
        groups.length.should.be.exactly(1)
      }
    );
  });

  it('list groups for a non-empty unit', () => {
    const bundle = {
      authData: {
        soap_username: 'dummy',
        soap_password: 'dummy',
      },
      inputData: {
        unit_id: 123
      }
    };

    const scope = nock(/example\.com/)
    .post('/SOAP/V3/Stat.php')
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/groupList')
    .reply(200, sample_groups_2);

    return appTester(App.triggers.group.operation.perform, bundle).then(
      groups => {
        groups.should.be.instanceof(Array)
        groups.length.should.be.exactly(2)
      }
    );
  });
});
