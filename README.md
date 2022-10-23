# Passport Example

## Features

- google passport
- facebook passport
- airbnb style eslint
- swagger api doc

## install

```
$ npm install
```

## .env file

Please create a new *.env* file in the root directory

```
APP_NAME="<app name>"

GOOGLE_CLIENT_ID="<google's client id>"
GOOGLE_CLIENT_SECRET="<google's client secret>"
GOOGLE_CALLBACK_URL="<google's callback url>"

FACEBOOK_APP_ID="<facebook's app id>"
FACEBOOK_APP_SECRET="<facebook's app secret>"
FACEBOOK_CALLBACK_URL="<facebook's callback url>"

PASSWORD_SALT_ROUNDS=<password salt rounds>

SERVER_PORT=<The port started by express>
SERVER_ERROR_MSG=<Basic generic server error message when the server fails>

TOKEN_SECRET="<When logging in, token's secret>"
TOKEN_EXPIRES_IN=<number, seconds>
```

## Scripts

```
// run server
$ npm run start

// run eslint
$ npm run lint

// build swagger output file
$ npm run swagger-autogen
```

## swagger api document

*http://localhost:3000/api-docs* or */api-docs*

## Directory Structure

```
.
├── README.md
├── app.js                              express.js entry
├── server.js                           main program entry
├── .eslintrc                           eslint configuration file
├── .env                                environment variable configuration file
├── swagger.js                          swagger configuration file
├── swagger-output.json                 swagger output file
├── db
│   ├── index.js                        Models centralized export
│   ├── models                          model directory
│   ├── relationship.js                 model relationship
│   ├── sequelize.js                    sequelize connection instance
│   └── setup.js                        SQL initialization task
├── middleware                          expressmiddleware directory
│   ├── index.js                        middleware centralized export
│   ├── authenticateMiddleware.js       ajax api usage
│   ├── needLoggedInMiddleware.js       after logging in, the page uses
│   ├── needNotLoggedInMiddleware.js    before logging in, the page uses
│   └── parseUserMiddleware.js          general page usage
├── package-lock.json
├── package.json
├── public                              public static file directory
│   ├── css                             css directory
│   ├── image                           image directory
│   └── js                              js directory
├── routes                              express route
│   ├── auth.js                         auth route
│   ├── users.js                        users route
│   ├── site.js                         site route
│   ├── strategy.js                     strategy route
│   ├── page.js                         general page route
│   ├── signInAfterPage.js              after logging in route
│   └── signInBeforePage.js             before logging in route
├── strategies                          login strategies directory
│   ├── facebookStrategy.js             facebook strategy
│   └── googleStrategy.js               google strategy
├── tools                               utility functions
│   └── auth                            auth funtions directory
│       └── index.js                    auth functions centralized export
│   └── users                           users funtions directory
│       └── index.js                    users functions centralized export
│   └── site                            site funtions directory
│       └── index.js                    site functions centralized export
└── views                               ejs views directory
    ├── layout                          ejs layout directory
    │   ├── basicLayout.ejs
    │   └── signLayout.ejs
    ├── partial                         ejs partial directory
    │   ├── footer.ejs
    │   └── header.ejs
    ├── home.ejs
    ├── dashboard.ejs
    ├── profile.ejs
    ├── signIn.ejs
    └── signUp.ejs
```
