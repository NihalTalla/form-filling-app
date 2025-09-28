const mysql = require('mysql2/promise');
require('dotenv').config();

const resetDatabase = async () => {
  console.log('🔄 Resetting database...');
  
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
  };

  let connection;

  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Drop and recreate database
    const dbName = process.env.DB_NAME || 'demo';
    await connection.execute(`DROP DATABASE IF EXISTS \`${dbName}\``);
    console.log(`🗑️ Dropped database '${dbName}' if it existed`);
    
    await connection.execute(`CREATE DATABASE \`${dbName}\``);
    console.log(`✅ Created database '${dbName}'`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);
    console.log(`✅ Using database '${dbName}'`);

    // Create users table with our simple schema
    const createTableQuery = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('✅ Users table created with correct schema');

    // Check table structure
    const [tableInfo] = await connection.execute('DESCRIBE users');
    console.log('📋 Table structure:');
    console.table(tableInfo);

    console.log('🎉 Database reset completed successfully!');

  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

// Run reset if this script is executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('✅ Database reset complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database reset failed:', error);
      process.exit(1);
    });
}

module.exports = { resetDatabase };