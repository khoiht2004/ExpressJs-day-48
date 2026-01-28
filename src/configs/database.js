require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // Chờ nếu không có connection available
    connectionLimit: 10, // Tối đa 10 connections cùng lúc
    queueLimit: 0, // Không giới hạn số lượng request chờ
});

module.exports = pool;
