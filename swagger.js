const swaggerAutogen = require('swagger-autogen')();
const dotenv = require('dotenv');

dotenv.config();

let host = '';
const schemes = [];
if (process.env.NODE_ENV === 'production') {
  host = process.env.APP_DOMAIN;
  schemes.push('https');
}
if (process.env.NODE_ENV === 'development') {
  host = `localhost:${process.env.SERVER_PORT}`;
  schemes.push('http');
}

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host,
  schemes,
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.js', './routes/users.js', './routes/site.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
