const mysql = require('mysql2')
//Connection with DataBase
const connection = mysql.createConnection({
  // host: '10.132.0.211',
  // user: 'root',
  // password: 'ayushtamboli',
  // database: 'webform'
  host: 'localhost',
  user: 'root',
  password: 'Nic@1234',
  database: 'webform',
  port: '3306'
});

//for connection check
connection.connect( (error)=>{
  if(error) {
    console.log(error)
  } else {
    console.log("mysql database connected successfuly")
  }
})


module.exports = connection;


































































































// Developed By- Ayush Tamboli, Project Tranee, NIC(Mungeli), Mobile- 9039272267, Email- ayushtamboli2@gmail.com