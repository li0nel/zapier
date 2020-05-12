var convert = require('xml-js');
const util = require('util');

let body = convert.xml2js('<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://secure.airship.co.uk/SOAP/V3/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:createContactResponse><output xsi:type="xsd:int">27891429</output></ns1:createContactResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>', {
  compact: true,
  trim: true,
  nativeType: true
})

console.log(body['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns1:createContactResponse']['output']['_text'])