var convert = require('xml-js');

const searchContact = (z, bundle) => {
  // let xml = fs.readFileSync(path.resolve(__dirname, './soap-envelopes/get_system_users.xml'), 'utf-8');
  let xml = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getContactEmail><username xsi:type="xsd:string">{{username}}</username><password xsi:type="xsd:string">{{password}}</password><email xsi:type="xsd:string">{{email}}</email></ns1:getContactEmail></SOAP-ENV:Body></SOAP-ENV:Envelope>'
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);
  xml = xml.replace(/{{email}}/g, bundle.inputData.email);

  const promise = z.request({
    method: 'POST',
    url: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/Contact.php`,
    headers: {
      SOAPAction: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/getContactEmail`,
      'Content-Type': 'application/text+xml; charset=utf-8'
    },
    body: xml
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then(response => {
    if (response.status === 500) {
      throw new Error('The credentials you supplied are invalid');
    }
    
    let body = convert.xml2js(response.content, {
      compact: true,
      trim: true,
      nativeType: true
    });

    let contactData = body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getContactEmailResponse']['output'].contactData;

    return contactData === undefined ? [] : [{
      id: contactData['contactid']['_text'],
      firstname: contactData['firstname']['_text'],
      mobilenumber: contactData['mobilenumber']['_text'],
      email: contactData['email']['_text'],
      allowsms: contactData['allowsms']['_text'],
      allowcall: contactData['allowcall']['_text'],
      allowemail: contactData['allowemail']['_text'],
      allowsnailmail: contactData['allowsnailmail']['_text']
    }];
  });
}

// We recommend writing your creates separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'contact',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Contact',
  display: {
    label: 'Search Contact',
    description: 'Search Contact By Email.'
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      { key: 'email', required: true, type: 'string' },
    ],
    perform: searchContact,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 27891429,
      firstname: 'Lionel',
      mobilenumber: 447760502783,
      email: 'lionel@wi5.io',
      allowsms: 'N',
      allowcall: 'N',
      allowemail: 'N',
      allowsnailmail: 'N'
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      {key: 'id', label: 'Contact ID'},
      {key: 'firstname', label: 'First Name'},
      {key: 'mobilenumber', label: 'Mobile Number'},
      {key: 'email', label: 'Email'},
      {key: 'allowsms', label: 'Allows SMS'},
      {key: 'allowcall', label: 'Allows Call'},
      {key: 'allowemail', label: 'Allows Email'},
      {key: 'allowsnailmail', label: 'Allows Snail Mail'}
    ]
  }
};