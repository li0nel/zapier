/* globals describe, it */
const sample = require('../samples/sample_contact');

require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

// describe('creates', () => {
//   describe('create contact create', () => {
//     it('should create a new contact', done => {
//       const bundle = {
//         authData: {
//           atreemoURL: 'testasdadasdas.com'
//         },
//         inputData: {
//           firstName: 'Leo',
//           email: 'leo@gmail.com'
//         }
//       };

//       appTester(App.creates.contact.operation.perform, bundle)
//         .then(result => {
//           result.should.have.property('CtcID');
//           done();
//         })
//         .catch(done);
//     });
//   });
// });
