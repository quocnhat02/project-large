# CREATE SLAVE LINK TO MASTER

mysql> CHANGE MASTER TO
-> MASTER_HOST='172.20.0.2',
-> MASTER_PORT=3306,
-> MASTER_USER='root',
-> MASTER_PASSWORD='nhat',
-> master_log_file='binlog.000002',
-> master_log_pos=157,
-> master_connect_retry=60,
-> GET_MASTER_PUBLIC_KEY=1;

STOP SLAVE;

STOP REPLICA;

START SLAVE;

START REPLICA;

<!-- ADD USER -->

create user 'nhat'@'%' IDENTIFIED BY '123456'

GRANT ALL PRIVILEGES ON shopDev.\* TO 'nhat'@'%';

CREATE DATABASE shopDev;

<!-- CREATE KEY -->

openssl genrsa -out private_key.pem 2048

openssl rsa -pubout -in private_key.pem -out public_key.pem
