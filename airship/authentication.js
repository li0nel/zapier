var convert = require('xml-js');

const testAuth = (z , bundle) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getSystemUsers><username xsi:type="xsd:string">{{username}}</username><password xsi:type="xsd:string">{{password}}</password></ns1:getSystemUsers></SOAP-ENV:Body></SOAP-ENV:Envelope>' // fs.readFileSync(path.resolve(__dirname, './soap-envelopes/get_system_users.xml'), 'utf-8');
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);

  let body = convert.xml2js('<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/Admin" xmlns:ns2="https://secure.airship.co.uk/SOAP/V3/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:getSystemUsersResponse><output SOAP-ENC:arrayType="ns2:authDetails[2]" xsi:type="ns2:authDetailsArray"><item xsi:type="ns2:authDetails"><userid xsi:type="xsd:int">5720</userid><roleid xsi:type="xsd:int">982</roleid><unitid xsi:type="xsd:int">3764</unitid><username xsi:type="xsd:string">ptsupport341</username><password xsi:type="xsd:string">***</password><firstname xsi:type="xsd:string">Powertext</firstname><lastname xsi:type="xsd:string">Support</lastname><mobilenumber xsi:type="xsd:string">447519694019</mobilenumber><email xsi:type="xsd:string">support@airship.co.uk</email><telephone xsi:type="xsd:string">08456580108</telephone><createdtime xsi:type="xsd:int">1588758656</createdtime><candelete xsi:type="xsd:string">N</candelete><ptadminuser xsi:type="xsd:string">Y</ptadminuser></item><item xsi:type="ns2:authDetails"><userid xsi:type="xsd:int">5721</userid><roleid xsi:type="xsd:int">983</roleid><unitid xsi:type="xsd:int">3764</unitid><username xsi:type="xsd:string">LionelM</username><password xsi:type="xsd:string">***</password><firstname xsi:type="xsd:string">Lionel</firstname><lastname xsi:type="xsd:string">Martin</lastname><mobilenumber xsi:type="xsd:string">07760502782</mobilenumber><email xsi:type="xsd:string">lionel@wi5.io</email><createdtime xsi:type="xsd:int">1588758783</createdtime><candelete xsi:type="xsd:string">Y</candelete><ptadminuser xsi:type="xsd:string">N</ptadminuser></item></output></ns1:getSystemUsersResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>', {
    compact: true,
    trim: true,
    nativeType: true
  });

  return body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getSystemUsersResponse']['output']['item'].map(user => ({
    user_id: user.userid._text,
    email: user.email._text
  }))[1];

  // const promise = z.request({
  //   method: 'POST',
  //   url: `https://secure.airship.co.uk/SOAP/V3/Admin.php`,
  //   headers: {
  //     SOAPAction: 'https://secure.airship.co.uk/SOAP/V3/getSystemUsers',
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

  //   z.console.log('response ', response.content)

  //   // let body = JSON.parse(xmlParser.toJson(response.content));
  //   // return body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:getSystemUsersResponse']['output']['item'].map(user => user.userid['$t']);
  // });
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
    perform: () => ({
      access_token: 'dummy'
    })
  },
  // assuming "email" is a key returned from the test
  connectionLabel: '{{email}}'
};
