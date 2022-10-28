const swaggerAutogen = require('swagger-autogen')();
const dotenv = require('dotenv');

dotenv.config();

let host = '';
if (process.env.NODE_ENV === 'production') {
  host = process.env.APP_DOMAIN;
}
if (process.env.NODE_ENV === 'development') {
  host = `http://localhost:${process.env.SERVER_PORT}`;
}

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host,
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.js', './routes/users.js', './routes/site.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
