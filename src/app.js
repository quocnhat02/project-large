'use strict';

const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
// const { checkOverload } = require('./helpers/check.connect');

require('dotenv').config();

const app = express();

// init middlewares
app.use(morgan('common'));
app.use(helmet());
app.use(compression());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

// init db
require('./databases/init.mongodb');

// checkOverload();

// init router
app.use('', require('./routes'));

// handle errors
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
