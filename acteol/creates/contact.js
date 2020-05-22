const sample = require('../samples/contact');

const createContact = (z, bundle) => {
  const promise = z.request({
    url: `https://${bundle.authData.atreemoURL}/api/Contact/PostContact`,
    method: 'POST',
    body: {
      FirstName: bundle.inputData.firstName,
      Email: bundle.inputData.email,
    }
  });

  return promise.then(response => response.json);
}

// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'contact',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Contact',
  display: {
    label: 'Create Contact',
    description: 'Creates a new contact.'
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      { key: 'firstName', required: true, type: 'string' },
      { key: 'email', required: true, type: 'string' }
    ],
    perform: createContact,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: sample,

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      { key: 'CtcID', label: 'Contact ID' },
      { key: 'FirstName', label: 'First name' },
      { key: 'LastName', label: 'Last name' },
      { key: 'Email', label: 'Email' },
      { key: 'CpyID', label: 'Company ID' }
    ]
  }
};
