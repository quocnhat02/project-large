const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());

app.get('/', (req, res) => {
  res.status(200).send('Hello, World!');
});

module.exports = app;
