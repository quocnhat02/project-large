'use strict';

const app = require('./src/app');

const PORT = process.env.PORT || 3096;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log(`Server was closed on port ${PORT}`);
  });
});
