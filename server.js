const http = require('http');
const app = require('./src/app');

const port = 5000;

const server = new http.Server(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Express Server`));
});
