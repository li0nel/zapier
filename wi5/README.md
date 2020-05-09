# Wi5 Zapier application

Feel free to deploy in your own Zapier account for testing.

```
npm install -g zapier-platform-cli

npm install

zapier login --sso

zapier register

export AUTH0_CLIENT_ID=1234 AUTH0_CLIENT_SECRET=asdf AUTH0_DOMAIN=auth-json-server.zapier-staging.com OAUTH_TOKEN_URL=/oauth/access-token OAUTH_CONTENT_TYPE=application/x-www-form-urlencoded OAUTH_REFRESH_TOKEN_URL=/oauth/refresh-token OAUTH_USER_PROFILE_URL=/me

zapier test

zapier push
```

// TODO sort out how to deploy in CI (only supports SSO login for now - or need to create auth file ~/.zapierrc deploy key from CircleCI env var)?

// TODO create a Resource for an Order or a Customer or a Product