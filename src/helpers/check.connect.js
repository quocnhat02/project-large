'use strict';

const mongoose = require('mongoose');

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  return numConnection;
};

module.exports = {
  countConnect,
};
