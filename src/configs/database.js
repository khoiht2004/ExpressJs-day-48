require("dotenv").config();
const mysql = require("mysql2/promise");

/**
 * Tạo connection pool để kết nối MySQL
 * Pool giúp quản lý nhiều kết nối hiệu quả hơn so với single connection
 */
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

/**
 * Test kết nối database
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL connected successfully!");
        console.log(`📦 Database: ${process.env.DB_NAME || "f8_nodejs_day48"}`);
        connection.release(); // Trả connection về pool
    } catch (error) {
        console.error("❌ MySQL connection failed:");
        console.error(`   Error: ${error.message}`);
        console.error("\n💡 Hãy kiểm tra:");
        console.error("   1. MySQL server đã chạy chưa?");
        console.error("   2. Thông tin trong file .env có đúng không?");
        console.error("   3. Database đã được tạo chưa?");
    }
}

// Test connection khi khởi động
testConnection();

module.exports = pool;
