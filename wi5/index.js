const orderTrigger = require('./triggers/order');
const merchantList = require('./triggers/merchantList');
const authentication = require('./authentication');

// To include the Authorization header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers['Authorization'] = `Bearer ${bundle.authData.access_token}`
  }
  return request;
};

const handleHTTPError = (response, z) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }
  return response;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  beforeRequest: [
    includeBearerToken
  ],

  afterResponse: [
    handleHTTPError
  ],

  resources: {
  },

  triggers: {
    [orderTrigger.key]: orderTrigger,
    [merchantList.key]: merchantList,
  },

  searches: {
  },

  creates: {
  }
};

module.exports = App;
