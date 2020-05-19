var convert = require('xml-js');

const groupList = (z, bundle) => {
  // return [
  //   { id: '93262', name: 'Default (Default Folder)' },
  //   { id: '93263', name: 'WiFi (Default Folder)' }
  // ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:groupList><username xsi:type="xsd:string">{{username}}</username><password xsi:type="xsd:string">{{password}}</password><unitID xsi:type="xsd:int">{{unit_id}}</unitID></ns1:groupList></SOAP-ENV:Body></SOAP-ENV:Envelope>';
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);
  xml = xml.replace(/{{unit_id}}/g, bundle.inputData.unit_id);

  const promise = z.request({
    method: 'POST',
    url: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/Stat.php`,
    headers: {
      SOAPAction: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/groupList`,
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

    let groups = body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:groupListResponse']['output']['item']['groups']['item'];
    let group_array = groups.constructor === Array ? groups : [groups];

    return group_array.map(g => ({
      id: g.groupid['_text'],
      name: g.groupname['_text']
    }));
  });
}

module.exports = {
  key: 'group',
  noun: 'Group',

  display: {
    label: 'List Groups',
    description: 'List available Airship Groups.',
    hidden: true
  },

  operation: {
    perform: groupList,
  }
};
