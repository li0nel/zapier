/* globals describe, it */
const sample = require('../samples/sample_order');

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('triggers', () => {
  describe('new order trigger', () => {
    it('should load order from fake hook', done => {
      const bundle = {
        inputData: {
          appUrl: 'private-90b71-zapierhooks.apiary-mock.com'
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

      appTester(App.triggers.order.operation.perform, bundle)
        .then(results => {
          results.length.should.eql(1);
          done();
        })
        .catch(done);
    });

    it('should load order from list', done => {
      const bundle = {
        inputData: {
          appUrl: 'private-90b71-zapierhooks.apiary-mock.com'
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

      appTester(App.triggers.order.operation.performList, bundle)
        .then(results => {
          results.length.should.be.greaterThan(0);

          done();
        })
        .catch(done);
    });
  });
});
