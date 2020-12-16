/* globals describe, it */
require('should');
const zapier = require('zapier-platform-core');
zapier.tools.env.inject();

const App = require('../index');
const appTester = zapier.createAppTester(App);
const nock = require('nock');
const sample = require('../samples/order');
const sample_orders = require('../samples/orders');

describe('New Order trigger', () => {
  it('should load order', done => {
    const bundle = {
      inputData: {
        merchant_url: 'example.com'
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
    .query({paymentStatus: 'pos-submitted,payment-captured'})
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
        merchant_url: 'example.com'
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
    .query({paymentStatus: 'pos-submitted,payment-captured'})
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
