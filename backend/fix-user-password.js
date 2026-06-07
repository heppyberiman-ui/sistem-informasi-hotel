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
    const hash = "$2b$10$AaXAZw5yd2Pr2eQGZ5OekuKwP1JQXo.HG.m6WxGYthwDst2W91uZC";
    await conn.query(
      "UPDATE users SET password = ?, role = ? WHERE email = ?",
      [hash, "user", "user@gmail.com"],
    );
    const [rows] = await conn.query(
      "SELECT id, nama, email, password, role FROM users WHERE email = ?",
      ["user@gmail.com"],
    );
    console.log("UPDATED_RECORD=" + JSON.stringify(rows, null, 2));
  } finally {
    await conn.end();
  }
})();
