const {Pool} = require("pg");

async function getDefault(id) {
    const pool = new Pool({
        connectionString: process.env.DBURL
    });
    try {
        const result = await pool.query("SELECT * FROM calendars WHERE user_id = $1 AND is_default = true", [id]);
        const defaultCalendar = result.rows[0];
        if (defaultCalendar) {
            const events = await pool.query("SELECT * FROM calendar_events WHERE calendar_id = $1", [defaultCalendar.id]);
            return {status: true, name: defaultCalendar.name, description: defaultCalendar.description, events: events.rows};
        }
        else return {status: false};
    }
    catch (err) {
        console.error("Error:", err);
    }
    pool.end();
}

module.exports = {getDefault};