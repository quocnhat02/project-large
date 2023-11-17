const { default: mongoose } = require('mongoose');
const os = require('node:os');
const process = require('process');

const { _SECONDS_OVERLOAD_ } = require('../configs/constants');

const countConnect = () => {
  const numConnect = mongoose.connections.length;
  return numConnect;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnect = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connect: ${numConnect}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    const maxConnect = numCores * 5;

    if (numConnect > maxConnect) {
      console.log(`Connect overload detected`);
    }
  }, _SECONDS_OVERLOAD_);
};

module.exports = { countConnect, checkOverload };
