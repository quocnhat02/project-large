const express = require('express');
const morgan = require('morgan');

const app = express();

// init middlewares
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).send('Hello, World!');
});

module.exports = app;
