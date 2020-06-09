const sample_hubspot_metrics = require('../samples/hubspot_metrics')

const getDeals = (z, bundle, deals = [], offset = 0, limit = 250) => {
  const promise = z.request({
    method: 'GET',
    url: 'https://api.hubapi.com/deals/v1/deal/paged',
    headers: {
    },
    params: {
      hapikey: bundle.authData.apiKey,
      includeAssociations: 'true',
      limit: limit,
      offset: offset,
      properties: ['dealname', 'pipeline', 'dealstage', 'pos_provider', 'locations']
    },
    qsStringifyOptions: { indices: false }
  });

  return promise.then(response => {
    if (response.status === 500) {
      throw new Error('The credentials you supplied are invalid');
    }

    let _deals = JSON.parse(response.content);
    
    deals = deals.concat(_deals.deals.map(
      d => (
        {
          id: d.dealId,
          isDeleted: d.isDeleted,
          pipeline_id: d.properties.pipeline ? parseInt(d.properties.pipeline.value) : undefined,
          stage_id: d.properties.dealstage ? parseInt(d.properties.dealstage.value) : undefined,
          name: d.properties.dealname ? d.properties.dealname.value : undefined,
          pos_provider: d.properties.pos_provider ? d.properties.pos_provider.value : undefined,
          nb_locations: d.properties.locations ? parseInt(d.properties.locations.value) : undefined
        }
      )
    ).filter(
        d => [894898, 989073].includes(d.pipeline_id) && d.stage_id
      )
    )

    if (!_deals.hasMore)
      return deals;
    else
      return getDeals(z, bundle, deals, _deals.offset)
  });
}

const getHubspotMetrics = (z, bundle) => {
  return getDeals(z, bundle).then(deals => {
    let leads = deals.filter(d => [
      2175064,
      2175063,
      2175042,
      2174910,
      2142244,
      2174781,
      989092
    ].includes(d.stage_id));

    let prospects = deals.filter(d => [
      2174711,
      2174712,
      894902,
      2142243,
      22172280,
      989074,
      989076,
      989089,
      989090
    ].includes(d.stage_id));

    let customers = deals.filter(d => [
      894903,
      989091
    ].includes(d.stage_id));

    return [{
        leads: {
            locations: leads.reduce((acc, val) => val.nb_locations ? acc + val.nb_locations : acc, 0),
            merchants: leads.length
        },
        prospects: {
            locations: prospects.reduce((acc, val) => val.nb_locations ? acc + val.nb_locations : acc, 0),
            merchants: prospects.length
        },
        customers: {
            locations: customers.reduce((acc, val) => val.nb_locations ? acc + val.nb_locations : acc, 0),
            merchants: customers.length
        }
    }]
  }
  );
};

module.exports = {
  key: 'hsmetrics',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Hubspot Metrics',
  display: {
    label: 'Fetch Hubspot Metrics',
    description: 'Fetch Hubspot Metrics.',
  },

  // `operation` is where we make the call to your API to do the search
  operation: {
    // This search only has one search field. Your searches might have just one, or many
    // search fields.
    inputFields: [
      { key: 'dummy', required: false, type: 'string' },
    ],

    perform: getHubspotMetrics,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: sample_hubspot_metrics,

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      // { key: 'id', label: 'ID' },
      // { key: 'name', label: 'Name' }
    ],
  },
};
