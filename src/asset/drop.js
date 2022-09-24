const fs = require('fs');
const { pool } = require('./db');

const drop = async () => {
    try {
        const fileSQL = await fs.readFileSync('src/assets/drop.sql', { encoding: 'utf8' });

        const splits = fileSQL.split(';');
        
        for (let i = 0; i < splits.length; i += 1) {
            const sql = splits[i]

            if (sql.indexOf('DROP') !== -1) {
                const [res, err] = await pool.execute(sql);
                console.log(`DB DROP COUNT: ${i}`);
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0) ;
    }
}

drop();