import mysql from 'mysql2/promise';

function createPool() {
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

  if (dbUrl && dbUrl.trim() !== '') {
    try {
      const parsed = new URL(dbUrl);
      return mysql.createPool({
        host: parsed.hostname,
        port: Number(parsed.port) || 3306,
        user: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname ? parsed.pathname.replace(/^\//, '') : 'defaultdb',
        ssl: {
          rejectUnauthorized: false
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    } catch {
      // fallback
    }
  }

  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    ssl: process.env.DB_HOST?.includes('aivencloud.com') || process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Global cached pool for Next.js hot reload / serverless instances
declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

const pool = globalThis.__mysqlPool || createPool();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__mysqlPool = pool;
}

export default pool;
