# PI Vault

A password manager for Slack

[Install PI Vault for Slack](https://slack.com/oauth/v2/authorize?client_id=567034155908.1018870696759&scope=chat:write)

This app uses the [Bolt for Slack](https://slack.dev/bolt/concepts) framework and Google Firebase.

## Slack app configuration

1. Create an [app](https://api.slack.com/apps) on Slack
2. Enable `Home Tab` in `App Home`
3. Enable `Interactivity & Shortcuts` and enter your `Request url`
4. Enable 'Event Subscription`
  - Subscribe to `Bot Events`: `app_home_opened`
5. Add `Bot Token Scopes` in `OAuth & Permissions`
  - `chat:write`
6. Enable distribution under `Manage Distribution` and enter your `Redirect url`

## Firebase configuration

1. Create a new [Firebase project](https://console.firebase.google.com)
2. Enable `Firestore`
3. Create a `Service Account` under `Project Settings`

## Run the app

1. Install dependencies via `npm` or `yarn`
2. Create a `.env` file and with following keys
  - `SLACK_SIGNING_SECRET=<your Slack app's signing secret>`
  - `SLACK_CLIENT_ID=<your Slack app's client id>`
  - `SLACK_CLIENT_SECRET=<your Slack app's client secret>`
  - `SLACK_REDIRECT_URL=<your redirect url>`
  - `SLACK_API_URL=https://slack.com/api`
  - `SLACK_APP_ID=<your Slack app id>`
  - `FIREBASE_SERVICE_ACCOUNT=<path to your firebase service account key>`
  - `FIREBASE_PROJECT_ID=<your firebase project id>`
