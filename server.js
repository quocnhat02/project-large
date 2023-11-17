const http = require('http');
const app = require('./src/app');

const port = 3000;

const server = new http.Server(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
