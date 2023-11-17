const http = require('http');
const app = require('./src/app');
const { default: mongoose } = require('mongoose');
const {
  app: { port },
} = require('./src/configs/config.mongodb');

const PORT = port || 5001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  server.close(() => console.log('Express server closed'));

  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
