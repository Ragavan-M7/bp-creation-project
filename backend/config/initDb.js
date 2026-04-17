
// ...........Command: node config/initDb.js  (Run this ONCE to create the database and table)......

const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let conn;
  try {
    // Connect WITHOUT specifying database first (it may not exist yet)
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // Create database if not exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database '${process.env.DB_NAME}' ready`);

    // Switch to our database
    await conn.query(`USE \`${process.env.DB_NAME}\``);

    // Create business_partners table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS business_partners (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        bp_code     VARCHAR(20)  NOT NULL UNIQUE,
        bp_name     VARCHAR(100) NOT NULL,
        email       VARCHAR(150) NOT NULL UNIQUE,
        mobile_no   VARCHAR(20)  NOT NULL,
        status      ENUM('Approved','Rejected','Pending') NOT NULL DEFAULT 'Pending',
        customer_group VARCHAR(50),
        contact_person VARCHAR(100),
        gst_no      VARCHAR(20),
        city        VARCHAR(60),
        state       VARCHAR(60),
        country     VARCHAR(60),
        postal_code VARCHAR(10),
        address     VARCHAR(255),
        ship_city   VARCHAR(60),
        ship_state  VARCHAR(60),
        ship_country VARCHAR(60),
        ship_postal  VARCHAR(10),
        ship_address VARCHAR(255),
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅ Table business_partners ready');

    // Seed sample data
    const sampleData = [
      ['ASN001', 'Suresh Babu', 'suresh@company.com', '+91 93928 87654', 'Approved'],
      ['ASN002', 'Priya Ramesh', 'priya@company.com', '+91 98765 43210', 'Rejected'],
      ['ASN003', 'Venkat Subbu', 'venkat@company.com', '+91 76542 19086', 'Approved'],
    ];

    for (const [bp_code, bp_name, email, mobile_no, status] of sampleData) {
      await conn.query(
        `INSERT IGNORE INTO business_partners (bp_code, bp_name, email, mobile_no, status) VALUES (?,?,?,?,?)`,
        [bp_code, bp_name, email, mobile_no, status]
      );
    }
    console.log('✅ Sample data seeded');
    console.log('\n🚀 Database setup complete! Now run: npm run dev\n');

  } catch (err) {
    console.error('❌ Init failed:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

initializeDatabase();
