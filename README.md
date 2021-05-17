# M2

TypeGraphQL Boilerplate mark 2.

## Documentation

Documentation of this project lives [here](https://victorstein.github.io/M2/).
Any contribution will be greatly appreciated.

## Installation

* Clone the repo
	```git clone https://github.com/victorstein/covid-backend.git```

* Enter the repo directory
	```cd covid-backend```

* Install the dependencies
	```npm install```

* Create a .env file with the following set up. (examples in parentheses)

| KEY | DESCRIPTION | REQUIRED | DEFAULT
| ------ | ------ | ------ | --------- |
PORT| Port that the application runs | FALSE | 3002
NODE_ENV| Environment variable | FALSE | development
ADMIN_EMAIL | Email used to set up the first user | TRUE |
TOKEN_SECRET | Secret used to encrypt JWT | TRUE
REFRESH_TOKEN_SECRET | Secret used to encrypt Refresh token | TRUE
TOKEN_EXP | JWT expiration | FALSE | 15m
REFRESH_TOKEN_EXP | Refresh token expiration | FALSE | 1d
DB_USER | DB User | TRUE
DB_PASS | Database Password | TRUE
QUERY_COMPLEXITY_LIMIT | Limit of incoming requests complexity (nested fields) | FALSE | 20
RATE_LIMIT_BAN_EXP | Ban period after making too many request to a throttled endpoint | FALSE | 1d
EMAIL_PROVIDER_HOST | Email provider host | FALSE | smtp.gmail.com
EMAIL_PROVIDER_TLS_PORT | Email provider TLS port | FALSE | 587
EMAIL_PROVIDER_SSL_PORT | Email provider SSL port | FALSE | 465
EMAIL_PROVIDER_USER | Email address where emails will be sent from | TRUE |
EMAIL_PROVIDER_PASS | Password of email provider user | TRUE | 
EMAIL_VERIFICATION_EXP | Expiration of email validation upon signup | FALSE | 1w
EMAIL_PASSWORD_REQUEST_EXP | Expiration of pasword reset request | FALSE | 1d
ALLOWED_ORIGINS | Comma separated strings of allowed consumers (CORS) | FALSE |
SENTRY_DSN | Sentry DSN string | FALSE | 
SENTRY_SERVER_NAME | Servername that will be sent to sentry | FALSE
LOG_LEVEL | Log level for winston | FALSE | defaults to `silly` in development and `error` in production

* Finally, just run ```npm run dev``` for development, ```npm run build``` for webpack, or ```npm start``` (once built) to run from the dist folder

## Contributing

Feel free to submit your PRs for review. There's currently no template for contribution. As the project grows we will look into further implementation of this.

## Authors

<!-- prettier-ignore -->
<table><tr><td align="center"><a href="http://victorstein.github.io"><img src="https://avatars3.githubusercontent.com/u/11080740?v=3" width="100px;" /><br /><sub><b>Alfonso Gomez</b></sub></a><br /><a href="#question" title="Answering Questions">💬</a> <a href="#" title="Documentation">📖</a><a href="#tool" title="Tools">🔧</a> <a href="#review" title="Reviewed Pull Requests">👀</a> <a href="#maintenance" title="Maintenance">😎</a></td></table>
