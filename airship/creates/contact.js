var convert = require('xml-js');
const contactSearch = require('./searches/contact').perform;

const createContactIfNotExists = (z, bundle) => {
  if (!contactSearch(z, bundle).empty)
    return createContact(z.bundle);
}

const createContact = (z, bundle) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getSystemUsers><username xsi:type="xsd:string">{{username}}</username><password xsi:type="xsd:string">{{password}}</password></ns1:getSystemUsers></SOAP-ENV:Body></SOAP-ENV:Envelope>' // fs.readFileSync(path.resolve(__dirname, './soap-envelopes/get_system_users.xml'), 'utf-8');
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);

  let body = convert.xml2js('<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:createContactResponse><output xsi:type="xsd:int">27891429</output></ns1:createContactResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>', {
    compact: true,
    trim: true,
    nativeType: true
  });
  
  return {
    id: body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:createContactResponse']['output']['_text']
  };
  
  // let xml = fs.readFileSync(path.resolve(__dirname, '../soap-envelopes/create_contact.xml'), 'utf-8');
  // xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  // xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);
  // xml = xml.replace(/{{first_name}}/g, bundle.inputData.first_name);
  // xml = xml.replace(/{{mobile_number}}/g, bundle.inputData.mobile_number);
  // xml = xml.replace(/{{email}}/g, bundle.inputData.email);
  // xml = xml.replace(/{{allow_email}}/g, bundle.inputData.allow_email);
  // xml = xml.replace(/{{source_id}}/g, '37060');
  // xml = xml.replace(/{{group_id}}/g, bundle.inputData.group_id);

  // // create contact without consents.
  // // read contact.
  // // if contact was existing, preserve Airship consent
  // // if new contact, update consent
  // const promise = z.request({
  //   method: 'POST',
  //   url: `https://secure.airship.co.uk/SOAP/V3/Contact.php`,
  //   headers: {
  //     SOAPAction: 'https://secure.airship.co.uk/SOAP/V3/createContact',
  //     'Content-Type': 'application/text+xml; charset=utf-8'
  //   },
  //   body: xml
  // });

  // // This method can return any truthy value to indicate the credentials are valid.
  // // Raise an error to show
  // return promise.then(response => {
  //   if (response.status === 401) {
  //     throw new Error('The credentials you supplied are invalid');
  //   }
    
    
  //   let body = JSON.parse(xmlParser.toJson(response.content));
  //   return {
  //     id: body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:createContactResponse']['output']['$t']
  //   };
  // });
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
      {
        key: 'unit_id',
        required: true,
        label: 'Unit',
        dynamic: 'unit.id.name'
      },
      {
        key: 'group_id',
        required: true,
        label: 'Group',
        dynamic: 'group.id.name'
      },
      { key: 'first_name', required: true, type: 'string' },
      { key: 'mobile_number', required: false, type: 'string' },
      { key: 'email', required: true, type: 'string' },
      // { key: 'allow_email', required: true, type: 'string' },
    ],
    perform: createContactIfNotExists,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      contact_id: 27891284
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      { key: 'id', label: 'Contact ID' }
    ]
  }
};
