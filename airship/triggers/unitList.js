var convert = require('xml-js');

const unitList = (z, bundle) => {
  // return [
  //   { id: '3764', name: 'Head Office' },
  //   { id: '3765', name: 'Location 1' },
  //   { id: '3766', name: 'Location 2'},
  // ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:unitList><username xsi:type="xsd:string">{{username}}</username><password xsi:type="xsd:string">{{password}}</password></ns1:unitList></SOAP-ENV:Body></SOAP-ENV:Envelope>';
  xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);

  const promise = z.request({
    method: 'POST',
    url: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/Stat.php`,
    headers: {
      SOAPAction: `${process.env.AIRSHIP_PROTOCOL}://${process.env.AIRSHIP_DOMAIN}/SOAP/V3/unitList`,
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

    let units = body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:unitListResponse']['output']['item'];
    let unit_array = units.constructor === Array ? units : [units];

    return unit_array.map(u => ({
      id: u.unitid['_text'],
      name: u.name['_text']
    }));
  });
}

module.exports = {
  key: 'unit',
  noun: 'Unit',

  display: {
    label: 'List Units',
    description: 'List available Airship Units.',
    hidden: true
  },

  operation: {
    perform: unitList,
  }
};
