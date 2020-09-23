const merchantList = (z, bundle) => {
  const promise = z.request({
    method: 'GET',
    url: `https://houston.wi5.io/api/frontend/merchant-accounts`
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then(response => {
    if (response.status === 401) {
      throw new Error('The credentials you supplied are invalid');
    }

    return JSON.parse(response.content).map(merchant => ({
      id: merchant.id,
      url: `${merchant.externalId}.wi5.io`,
      name: merchant.name
    }));
  });
}

module.exports = {
  key: 'merchant',
  noun: 'Merchant',

  display: {
    label: 'List Merchants',
    description: 'List available Wi5 Merchants.',
    hidden: true
  },

  operation: {
    perform: merchantList,
  }
};
