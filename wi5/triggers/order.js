const sample = require('../samples/order');

const triggerOrder = (z, bundle) => {
  const responsePromise = z.request({
    method: 'GET',
    url: `https://${bundle.inputData.appUrl}/api/protected/merchant/orders`,
    params: {
      // add pagination here
    }
  });

  return responsePromise
    .then(response => JSON.parse(response.content));
};

module.exports = {
  key: 'order',
  noun: 'Order',

  display: {
    label: 'New Order',
    description: 'Triggers when a new order is created.'
  },

  operation: {
    inputFields: [
      {key: 'appUrl', label:'Application URL', required: true},
    ],
    perform: triggerOrder,
    performList: triggerOrder,

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
