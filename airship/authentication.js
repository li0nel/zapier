const fs = require('fs');
const path = require('path');
const xmlParser = require('xml2json');

const testAuth = (z , bundle) => {
  let xml = fs.readFileSync(path.resolve(__dirname, './soap-envelopes/get_system_users.xml'), 'utf-8');
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);

  console.log(xml)
  console.log({
    SOAPAction: 'https://secure.airship.co.uk/SOAP/V3/Admin/getSystemUsers',
    'Content-Type': 'application/text+xml; charset=utf-8'
  })

  const promise = z.request({
    method: 'POST',
    url: `https://secure.airship.co.uk/SOAP/V3/Admin.php`,
    headers: {
      SOAPAction: 'https://secure.airship.co.uk/SOAP/V3/Admin/getSystemUsers',
      'Content-Type': 'application/text+xml; charset=utf-8'
    },
    body: xml
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then(response => {
    if (response.status === 401) {
      throw new Error('The credentials you supplied are invalid');
    }

    let body = JSON.parse(xmlParser.toJson(response.content));
    return body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getSystemUsersResponse']['output']['item'].map(user => user.userid['$t']);
  });
};

module.exports = {
  type: 'session',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    { key: 'soap_username', label: 'Airship SOAP Username', required: true, type: 'string' },
    { key: 'soap_password', label: 'Airship SOAP Password', required: true, type: 'password' }
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // The method that will exchange the fields provided by the user for session credentials.
  sessionConfig: {
    perform: () => {}
  },
  // assuming "username" is a key returned from the test
  connectionLabel: 'test' //'{{username}}'
};
