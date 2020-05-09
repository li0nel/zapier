const sample = require('../samples/sample_order');

const subscribeHook = (z, bundle) => {
  // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
  const data = {
    url: bundle.targetUrl,
    style: bundle.inputData.style
  };

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `https://${bundle.inputData.appUrl}/hooks`,
    method: 'POST',
    body: data
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options).then(response => JSON.parse(response.content));
};

const unsubscribeHook = (z, bundle) => {
  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.id;

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `https://${bundle.inputData.appUrl}/hooks/${hookId}`,
    method: 'DELETE'
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options).then(response => JSON.parse(response.content));
};

const getOrder = (z, bundle) => {
  // bundle.cleanedRequest will include the parsed JSON object (if it's not a
  // test poll) and also a .querystring property with the URL's query string.
  const order = {
    id: bundle.cleanedRequest.id,
    createdAt: bundle.cleanedRequest.createdAt,
    total: bundle.cleanedRequest.total,
    deliveryInstructions: bundle.cleanedRequest.deliveryInstructions,
    site: bundle.cleanedRequest.site,
    customer: bundle.cleanedRequest.customer,
    basketSnapshot: bundle.cleanedRequest.basketSnapshot
  };

  return [order];
};

const getFallbackRealOrder = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const responsePromise = z.request({
    method: 'GET',
    url: `https://${bundle.inputData.appUrl}/api/merchant/orders`,
    params: {
      // add pagination here
    }
  });
  return responsePromise
    .then(response => JSON.parse(response.content).data);
};

module.exports = {
  key: 'order_rest_hook',
  noun: 'Order',

  display: {
    label: 'New Order (REST Hook)',
    description: 'Triggers when a new order is created (REST Hook).'
  },

  operation: {
    inputFields: [
      {key: 'appUrl', label:'Application URL', required: true},
    ],
    type: 'hook',

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getOrder,
    performList: getFallbackRealOrder,

    sample: sample,

    outputFields: [
      {
        key: 'id',
        label: 'Order ID',
        type: 'string'
      },
      {
        key: 'createdAt',
        label: 'Created At',
        type: 'string'
      },
      {
        key: 'total',
        label: 'Total',
        type: 'integer'
      },
      {
        key: 'deliveryInstructions',
        label: 'Delivery Instructions',
        type: 'string'
      },
      {
        key: 'site__name',
        label: 'Site Name',
        type: 'string'
      },
      {
        key: 'customer__name',
        label: 'Customer Name',
        type: 'string'
      },
      {
        key: 'customer__email',
        label: 'Customer Email',
        type: 'string'
      },
      {
        key: 'customer__phone_number',
        label: 'Customer Phone Number',
        type: 'string'
      },
      {
        key: 'basketSnapshot[]name',
        label: 'Product',
        type: 'string'
      },
      {
        key: 'basketSnapshot[]portion__name',
        label: 'Portion',
        type: 'string'
      },
      {
        key: 'basketSnapshot[]quantity',
        label: 'Quantity',
        type: 'number'
      },
      {
        key: 'basketSnapshot[]portion__modifiers[]name',
        label: 'Modifiers',
        type: 'string'
      }
    ]
  }
};
