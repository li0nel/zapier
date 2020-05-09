# Wi5 Zapier application

Feel free to deploy in your own Zapier account for testing.

Once the application is published on Zapier as the official Wi5 app, each Merchant will be able to use their own Zapier account and create workflows that can be triggered each time their Wi5 MT application receive a new order.

```
npm install -g zapier-platform-cli

npm install

zapier login --sso

zapier register

zapier test

zapier push
```

When creating a Zap, use "private-90b71-zapierhooks.apiary-mock.com" as the `app_url` parameter. This make the Zapier application point to a Apiary mock server to poll orders and to register REST hooks.

// TODO sort out how to deploy in CI (only supports SSO login for now - or need to create auth file ~/.zapierrc deploy key from CircleCI env var)?

// TODO create a Resource for an Order or a Customer or a Product