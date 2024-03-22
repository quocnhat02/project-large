'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const {
  db: { host, name, port },
} = require('../configs/mongodb.config');

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    // dev
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        console.log(`Connected mongodb success with number: ${countConnect()}`);
      })
      .catch((err) => console.log(`Error connect mongodb: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
