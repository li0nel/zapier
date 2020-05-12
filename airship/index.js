const contactCreate = require('./creates/contact');
const contactSearch = require('./searches/contact');
const groupList = require('./triggers/groupList');
const unitList = require('./triggers/unitList');

const authentication = require('./authentication');

const sessionRefreshIf401 = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.RefreshAuthError(); // ask for a refresh & retry
  }
  return response;
};

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    // includeBearerToken
  ],

  afterResponse: [
    sessionRefreshIf401
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {},

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [unitList.key]: unitList,
    [groupList.key]: groupList,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
    [contactSearch.key]: contactSearch,
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [contactCreate.key]: contactCreate,
  }
};

// Finally, export the app.
module.exports = App;
