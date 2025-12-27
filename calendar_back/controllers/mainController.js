const {Pool} = require("pg");

async function getName(id) {
    const pool = new Pool({
        connectionString: process.env.DBURL
    });
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const rightUser = result.rows[0];
        return (rightUser) ? {status: true, id: rightUser.id, name: rightUser.name} : 
        {status: false, id: -1};
    }
    catch (err) {
        console.error("Error:", err);
    }
    pool.end();
}

module.exports = {getName}