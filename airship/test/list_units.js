/* global describe, it, before */
require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const fs = require('fs');
const nock = require('nock');
const path = require('path');

const sample_units = fs.readFileSync(path.resolve(__dirname, '../samples/units.xml'), 'utf-8');

process.env.AIRSHIP_PROTOCOL = 'https';
process.env.AIRSHIP_DOMAIN = 'example.com'

describe('list units', () => {
  it('list units for an account', () => {
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
    .matchHeader('soapaction', 'https://example.com/SOAP/V3/unitList')
    .reply(200, sample_units);

    return appTester(App.triggers.unit.operation.perform, bundle).then(
      units => {
        units.should.be.instanceof(Array)
        units.length.should.be.exactly(4)
      }
    );
  });
});
