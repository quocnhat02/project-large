'use strict';

const mongoose = require('mongoose');
const os = require('node:os');
const process = require('node:process');

const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  return numConnection;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connections based on number of cores
    const maxConnection = numCores * 5;

    console.log(`Active connection: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log(`Connection overload detected`);
    }
  }, _SECONDS); // monitor reload every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
