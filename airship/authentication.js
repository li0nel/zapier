var convert = require('xml-js');
const fs = require('fs');
const path = require('path');

const testAuth = (z , bundle) => {
  let xml = fs.readFileSync('./soap-envelopes/get_system_users.xml', 'utf-8');
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
    { key: 'soap_password', label: 'Airship SOAP Password', required: true, type: 'password' },
    { key: 'source_id', label: 'Airship Source ID', required: true, type: 'integer' }
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // assuming "email" is a key returned from the test
  connectionLabel: '{{email}}'
};
