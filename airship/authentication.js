var convert = require('xml-js');

const testAuth = (z , bundle) => {
  // let xml = fs.readFileSync(path.resolve(__dirname, './soap-envelopes/get_system_users.xml'), 'utf-8');
  let xml = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getSystemUsers><username xsi:type="xsd:string">{{username}}</username><password xsi:type="xsd:string">{{password}}</password></ns1:getSystemUsers></SOAP-ENV:Body></SOAP-ENV:Envelope>'
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);

  const promise = z.request({
    method: 'POST',
    url: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/Admin.php`,
    headers: {
      SOAPAction: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/getSystemUsers`,
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

    z.console.log(body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getSystemUsersResponse']['output']['item'].map(user => ({
      user_id: user.userid._text,
      email: user.email._text
    }))[1])

    return body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getSystemUsersResponse']['output']['item'].map(user => ({
      user_id: user.userid._text,
      email: user.email._text
    }))[1];
  });
};

module.exports = {
  type: 'custom',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    { key: 'soap_username', label: 'Airship SOAP Username', required: true, type: 'string' },
    { key: 'soap_password', label: 'Airship SOAP Password', required: true, type: 'password' }
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // assuming "email" is a key returned from the test
  connectionLabel: '{{email}}'
};
