// const fs = require('fs');
const path = require('path');
// const xmlParser = require('xml2json');

const groupList = (z, bundle) => {
  return [
    { id: '93262', name: 'Default (Default Folder)' },
    { id: '93263', name: 'WiFi (Default Folder)' }
  ];

  // bundle.inputData.unit_id

  // let xml = fs.readFileSync(path.resolve(__dirname, '../soap-envelopes/list_groups.xml'), 'utf-8');
  // xml = xml.replace(/{{username}}/g, bundle.authData.soap_username);
  // xml = xml.replace(/{{password}}/g, bundle.authData.soap_password);
  // xml = xml.replace(/{{unit_id}}/g, bundle.inputData.unit_id);

  // const promise = z.request({
  //   method: 'POST',
  //   url: `https://secure.airship.co.uk/SOAP/V3/Stat.php`,
  //   headers: {
  //     SOAPAction: 'https://secure.airship.co.uk/SOAP/V3/groupList',
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
  //   console.log(body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:groupListResponse']['output']['$t'])

  //   return {
  //     id: body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:groupListResponse']['output']['$t']
  //   };
  // });
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
