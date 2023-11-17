const express = require('express');
const dotenv = require('dotenv');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
// const { checkOverload } = require('./helpers/check.connect');
const router = require('./routes');

const app = express();

// init env
dotenv.config();

// init middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

// init db
require('./databases/init.mongodb');
// checkOverload();

// init router
app.use('/api/v1/', router);

// handler error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
