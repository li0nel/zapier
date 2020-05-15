var convert = require('xml-js');
const contactSearch = require('../searches/contact').operation.perform;

const createContactIfNotExists = (z, bundle) => {
  return contactSearch(z, bundle).then(contact => {
    return contact.length ? contact[0] : createContact(z, bundle).then(c => c);
  })
}

const createContact = (z, bundle) => {
  // let xml = fs.readFileSync(path.resolve(__dirname, '../soap-envelopes/create_contact.xml'), 'utf-8');
  let xml = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:createContact><username xsi:type="xsd:string">{{username}}</username><password xsi:type="xsd:string">{{password}}</password><contactData xsi:type="ns1:contactObject"><firstname xsi:type="xsd:string">{{first_name}}</firstname><email xsi:type="xsd:string">{{email}}</email><allowemail xsi:type="xsd:string">{{allow_email}}</allowemail><allowsms xsi:type="xsd:string">{{allow_email}}</allowsms><sourceid xsi:type="xsd:string">{{source_id}}</sourceid></contactData><groups SOAP-ENC:arrayType="xsd:int[1]" xsi:type="ns1:GroupArray"><item xsi:type="xsd:int">{{group_id}}</item></groups><consents SOAP-ENC:arrayType="ns1:updateContactConsent[1]" xsi:type="ns1:updateContactConsentArray"><item xsi:type="ns1:updateContactConsent"><consenttypeid xsi:type="xsd:string">1</consenttypeid><consentstatus xsi:type="xsd:string">{{allow_email}}</consentstatus></item></consents></ns1:createContact></SOAP-ENV:Body></SOAP-ENV:Envelope>'; // <mobilenumber xsi:type="xsd:string">{{mobile_number}}</mobilenumber>
    
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);
  xml = xml.replace(/{{first_name}}/g, bundle.inputData.first_name);
  // xml = xml.replace(/{{mobile_number}}/g, bundle.inputData.mobile_number);
  xml = xml.replace(/{{email}}/g, bundle.inputData.email);
  xml = xml.replace(/{{allow_email}}/g, 'Y'); //TODO
  xml = xml.replace(/{{source_id}}/g, bundle.inputData.source_id);
  xml = xml.replace(/{{group_id}}/g, bundle.inputData.group_id);

  const promise = z.request({
    method: 'POST',
    url: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/Contact.php`,
    headers: {
      SOAPAction: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/createContact`,
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

    return {
      id: body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:createContactResponse']['output']['_text']
    };
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
      { key: 'email', required: true, type: 'string' },
      { key: 'first_name', required: true, type: 'string' },
      { key: 'mobile_number', required: false, type: 'string' },
      { key: 'source_id', required: true, type: 'integer' },
      // { key: 'allow_email', required: true, type: 'string' },
    ],
    perform: createContactIfNotExists,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 27891284
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
