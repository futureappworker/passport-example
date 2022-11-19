# Passport Example

- google passport
- facebook passport
- airbnb style eslint
- swagger api doc
- dashboard page has skeleton

| :----: | :----: |
| Site URL | [https://passport-example.herokuapp.com](https://passport-example.herokuapp.com) |
| API Document | [https://passport-example.herokuapp.com/api-docs](https://passport-example.herokuapp.com/api-docs) |


## Feature

### Sign Up

The Sign Up page should allow users 3 options to create an account: 

- email and user defined password
- Google OAuth
- Facebook OAuth

### User Defined Password

The user defined password must be entered twice and match. In addition, the password must be validated by the following conditions.

- contains at least one lower character 
- contains at least one upper character 
- contains at least one digit character 
- contains at least one special character
- contains at least 8 characters

### Email Verification

- For the user defined password, after the validated password is entered, back-end app send an verification email to the email address provided.
- The email must contain a link, that if the user clicks the link, their email will be verified in the back-end and the user will be directed to a simple dashboard in a new browser.
- Only accounts that have email verified can access the simple dashboard.
- Users that have not verified email will only see a button or link that says “Resend Email Verification”, and clicking on this link will resend the same email verification.
- Only accounts created via email and password must be verified with email verification. 
- Facebook and Google OAuth sign up accounts do not need to send email verification, and can immediately access the simple dashboard.

### Login

Allow users to login through the 3 methods that users can sign up with:

- email and user defined password
- Google OAuth
- Facebook OAuth

### User Profile

- The user profile will display the user’s email and name (from Google or Facebook OAuth). In addition, the user can reset their name. 
- Everytime the user goes to user profile, the user can see the name they have chosen.

### Reset Password

In the simple dashboard, add the ability to reset password. 

The password must meet the same criterias as defined previously. 

In addition, the user must enter 3 text input boxes:
- Old password
- New password
- Re-enter new password

### Cookies and Logout

- Store cookies in the browser so that next time a logged in user returns to site, the user will be automatically logged in. 
- Logout feature, so that cookies can be cleared.

### User Database Dashboard

Dashboard page with a list of all users that have signed up to your app. 

For each user, show the following information:

- Timestamp of user sign up.
- Number of times logged in.
- Timestamp of the last user session. 

### User Statistics

At the top of the user database dashboard, show the following statistics:

- Total number of users who have signed up.
- Total number of users with active sessions today.
- Average number of active session users in the last 7 days rolling.


## Technology Stack

- Node
- Express
- Sequelize
- Swagger
- jQuery
- ESLint ( airbnb )

## Install

```
$ npm install
```

## Create .env file

Please create a new *.env* file in the root directory

```
APP_NAME="<app name>"

GOOGLE_CLIENT_ID="<google's client id>"
GOOGLE_CLIENT_SECRET="<google's client secret>"
GOOGLE_CALLBACK_PATHNAME="<google's callback pathname, E.g /auth/google/callback>"

FACEBOOK_APP_ID="<facebook's app id>"
FACEBOOK_APP_SECRET="<facebook's app secret>"
FACEBOOK_CALLBACK_PATHNAME="<facebook's callback pathname>, E.g /auth/facebook/callback"

PASSWORD_SALT_ROUNDS=<password salt rounds>

SERVER_PORT=<The port started by express>
SERVER_ERROR_MSG=<Basic generic server error message when the server fails>

TOKEN_SECRET="<When logging in, token's secret>"
TOKEN_EXPIRES_IN=<number, seconds>

EMAIL_VERIFICATION_FOR_EMAIL_EXPIRES_IN=<number, email verification for email expires in, seconds>

SENDGRID_API_KEY="<sendgrid api key>"

APP_DOMAIN="<your app domain, E.g passport-example.herokuapp.com>"

CLEARDB_DATABASE_URL="<cleardb database url>"
```

## Scripts

```
// run server
$ npm run start

// run dev server
$ npm run dev

// run eslint
$ npm run lint

// build swagger output file
$ npm run swagger-autogen
```

## Swagger API Document

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
│   └── sgMail                          sendgrid
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
