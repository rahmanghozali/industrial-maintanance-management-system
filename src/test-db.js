/*const pool = require("./db");

console.log("DB_HOST loaded:", Boolean(process.env.DB_HOST));
console.log("DB_NAME loaded:", Boolean(process.env.DB_NAME));
console.log("DB_USER loaded:", Boolean(process.env.DB_USER));
console.log("DB_PASSWORD loaded:", typeof process.env.DB_PASSWORD);
console.log("DB_PASSWORD exists:", Boolean(process.env.DB_PASSWORD));*/


const pool = require("./db");

async function testDatabaseConnection() {
    try {
        const result = await pool.query(`
            SELECT
                current_database() AS database_name,
                NOW() AS server_time
        `);

        console.log("Database connection successful!");
        console.log(result.rows[0]);

    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);

    } finally {
        await pool.end();
    }
}

testDatabaseConnection();
