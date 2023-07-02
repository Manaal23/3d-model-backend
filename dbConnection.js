const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "3d system",
    multipleStatements: true
    })
    db.connect(function (err) {
    if (err) {
    return console.error('error: ' + err.message);
    }else{
        console.log("Connection successfull with db:")
    }
})

module.exports = db;