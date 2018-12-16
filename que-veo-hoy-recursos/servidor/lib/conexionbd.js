const mysql      = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '3453',
  database : 'que_veo_hoy'
});

module.exports = connection;

