var convert = require('xml-js');
const fs = require('fs');
const path = require('path');

const unitList = (z, bundle) => {
  let xml = fs.readFileSync(path.resolve(__dirname, '../soap-envelopes/list_units.xml'), 'utf-8');
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
