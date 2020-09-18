const mysql = require('mysql');
const {
    promisify
} = require('util')
require("dotenv").config();


const database = {
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database: process.env.mysql_db,
    multipleStatements: true
};


const db = mysql.createPool(database);
db.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Database has to many connections");
        }
        if (err.code === "ECONNREFUSED") {
            console.error("Database connection was refused");
        }
    }

    if (connection) connection.release();
    console.log("DB is Connected");
    return;
});


db.query = promisify(db.query);


module.exports = db;