var querystring = require('querystring');

const testAuth = (z , bundle ) => {
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  // In this example, we'll hit httpbin, which validates the Authorization Header against the arguments passed in the URL path
  const promise = z.request({
    url: `https://${bundle.authData.atreemoURL}/api/Location/Get`
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then(response => {
    if (response.status === 401) {
      throw new Error('The Session Key you supplied is invalid');
    }
    return JSON.parse(response.content);
  });
};

const getOAuthToken = (z, bundle) => {
  const promise = z.request({
    method: 'POST',
    url: `https://${bundle.authData.atreemoURL}/token`,
    body: querystring.stringify({
      username: bundle.authData.username,
      password: bundle.authData.password,
      grant_type: 'password'
    })
  });

  return promise.then(response => {
    if (response.status === 401) {
      throw new Error('The username/password you supplied is invalid');
    }
    return JSON.parse(response.content);
  });
};

module.exports = {
  type: 'session',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    { key: 'atreemoURL', label: 'Atreemo Instance URL', required: true, type: 'string' },
    { key: 'username', label: 'Username', required: true, type: 'string' },
    { key: 'password', label: 'Password', required: true, type: 'password' }
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // The method that will exchange the fields provided by the user for session credentials.
  sessionConfig: {
    perform: getOAuthToken
  },
  // assuming "username" is a key returned from the test
  connectionLabel: '{{username}}'
};