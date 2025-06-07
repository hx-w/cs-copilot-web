import { Pool } from 'pg';

// 创建一个新的连接池实例
// 它会自动从环境变量 `DATABASE_URL` 中读取连接字符串
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // 在生产环境中，根据您的数据库提供商的要求，可能需要更严格的 SSL 配置
    rejectUnauthorized: false,
  },
});

export default pool;
