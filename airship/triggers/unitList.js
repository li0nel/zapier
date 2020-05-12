// const fs = require('fs');
const path = require('path');
// const xmlParser = require('xml2json');

const unitList = (z, bundle) => {
  return [
    { id: '3764', name: 'Head Office' },
    { id: '3765', name: 'Location 1' },
    { id: '3766', name: 'Location 2'},
  ];

  // let xml = fs.readFileSync(path.resolve(__dirname, '../soap-envelopes/list_units.xml'), 'utf-8');
  // xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  // xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);

  // const promise = z.request({
  //   method: 'POST',
  //   url: `https://secure.airship.co.uk/SOAP/V3/Stat.php`,
  //   headers: {
  //     SOAPAction: 'https://secure.airship.co.uk/SOAP/V3/unitList',
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
  //   console.log(body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:unitListResponse']['output']['$t'])
    
  //   return {
  //     id: body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:unitListResponse']['output']['$t']
  //   };
  // });
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
