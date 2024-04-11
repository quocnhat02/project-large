const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'nhat',
  password: '123456',
  database: 'shopDev',
});

pool.query('SELECT * FROM users', function (err, result) {
  if (err) throw err;
  console.log(`query:`, result);

  pool.end((err) => {
    if (err) throw err;
    console.log('connect closed');
  });
});
