const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hotel_db",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  });

  try {
    const [rows] = await conn.query(
      "SELECT id, nama, email, password, role FROM users WHERE email IN (?, ?)",
      ["user@gmail.com", "heppyberiman@gmail.com"],
    );
    console.log(JSON.stringify(rows, null, 2));
  } finally {
    await conn.end();
  }
})();
