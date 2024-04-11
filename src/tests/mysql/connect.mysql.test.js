const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'nhat',
  password: '123456',
  database: 'shopDev',
});

const batchSize = 1000;
const totalSize = 10000;

let currentId = 1;

console.time('----------TIME-------------');
const insertBatch = async () => {
  const values = [];

  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `nhat${i}`;
    const age = i;
    values.push([currentId, name, age]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd('----------TIME-------------');

    pool.end((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('connect pool closed success');
      }
    });
    return;
  }

  const sql = `INSERT INTO users (id, name, age) VALUES ?`;

  pool.query(sql, [values], async function (err, result) {
    if (err) throw err;
    console.log(`insert:`, result.affectedRows);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
