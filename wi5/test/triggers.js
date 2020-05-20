/* globals describe, it */
const sample = require('../samples/order');
const sample_orders = require('../samples/orders');
require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');

describe('New Order trigger', () => {
  it('should load order', done => {
    const bundle = {
      inputData: {
        appUrl: 'example.com'
      },
      cleanedRequest: {
        id: sample.id,
        createdAt: sample.createdAt,
        total: sample.total,
        deliveryInstructions: sample.deliveryInstructions,
        site: sample.site,
        customer: sample.customer,
        basketSnapshot: sample.basketSnapshot
      }
    };

    const scope = nock(/example\.com/)
    .get('/api/protected/merchant/orders')
    .reply(200, sample_orders);

    appTester(App.triggers.order.operation.perform, bundle)
      .then(results => {
        results.should.be.instanceof(Array)
        results.length.should.eql(1);
        results[0].should.have.ownProperty('id');
        results[0].should.have.ownProperty('customer');
        done();
      })
      .catch(done);
  });

  it('should load order from list', done => {
    const bundle = {
      inputData: {
        appUrl: 'example.com'
      },
      cleanedRequest: {
        id: sample.id,
        createdAt: sample.createdAt,
        total: sample.total,
        deliveryInstructions: sample.deliveryInstructions,
        site: sample.site,
        customer: sample.customer,
        basketSnapshot: sample.basketSnapshot
      }
    };

    const scope = nock(/example\.com/)
    .get('/api/protected/merchant/orders')
    .reply(200, sample_orders);

    appTester(App.triggers.order.operation.performList, bundle)
      .then(results => {
        results.should.be.instanceof(Array)
        results.length.should.eql(1);
        results[0].should.have.ownProperty('id');
        results[0].should.have.ownProperty('customer');
        done();
      })
      .catch(done);
  });
});
