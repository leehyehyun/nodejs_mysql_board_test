var mysql = require('mysql'); // 'mysql'라는 모듈 가져옴
var db = mysql.createConnection({
   host:'',
   user:'',
   password:'',
   database:''
 }); // 버전관리할때는 중요정보를 비운채로 올린다. 
db.connect();
module.exports = db; // 모듈로 꺼내놓을 API가 하나라면 module.exports 를 쓰고, 여러개라면 exports만 쓴다.
