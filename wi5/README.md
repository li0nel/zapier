# Wi5 Zapier application

Feel free to deploy in your own Zapier account for testing.

```
npm install -g zapier-platform-cli

npm install

zapier login --sso

zapier register

zapier test

zapier env:set 0.0.1 AUTH0_DOMAIN=staging-wi5.eu.auth0.com AUTH0_CLIENT_ID=NAjTwAnysSd1bTsmPxkhK0vdFPoyBb75 AUTH0_CLIENT_SECRET=xxxx

zapier push
```

// TODO sort out how to deploy in CI (only supports SSO login for now - or need to create auth file ~/.zapierrc deploy key from CircleCI env var)?

// TODO create a Resource for an Order or a Customer or a Product