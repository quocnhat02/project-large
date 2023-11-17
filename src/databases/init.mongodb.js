const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const {
  db: { host, port, name },
} = require('../configs/config.mongodb');

const mongoURI = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this._connect();
  }

  _connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(mongoURI, { maxPoolSize: 10 })
      .then(() => {
        console.log(`Database connection successful on ${name}`);
        console.log(`Numbers connect to mongodb have ${countConnect()}`);
      })
      .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const databaseInstance = Database.getInstance();

module.exports = databaseInstance;
