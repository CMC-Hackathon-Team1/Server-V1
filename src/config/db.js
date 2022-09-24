const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql2/promise');


const pool = mysql.createPool({

    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    timezone: '+09:00', // 데이터베이스 UTC 시간 관리 - 한국시간으로 설정
    charset: 'utf8mb4', // 데이터베이스 character-set 관리
    insecureAuth: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true,

    multipleStatements: true,

    // ----- connection pool options
  
    /**
     * The milliseconds before a timeout occurs during the initial connection to the MySQL server. (Default: 10 seconds)
     */
     connectTimeout: 10 * 1000,
  
    /**
    * Determines the pool's action when no connections are available and the limit has been reached. If true, the pool will queue
    * the connection request and call it when one becomes available. If false, the pool will immediately call back with an error.
    * (Default: true)
    */
    waitForConnections: true,
  
    /**
    * The maximum number of connections to create at once. (Default: 10)
    */
    connectionLimit: 5,
  
    /**
    * The maximum number of connection requests the pool will queue before returning an error from getConnection. If set to 0, there
    * is no limit to the number of queued connection requests. (Default: 0)
    */
    queueLimit: 1,
  
    /**
    * Enable keep-alive on the socket.  It's disabled by default, but the
    * user can enable it and supply an initial delay.
    */
    enableKeepAlive: true,
  
    /**
    * If keep-alive is enabled users can supply an initial delay.
    */
    keepAliveInitialDelay: 5,
});


module.exports = { pool };