const pool = require("./db");

async function getCalendars(id) {
    try {
        const result = await pool.query("SELECT * FROM calendars WHERE user_id = $1", [id]);
        const calendars = result.rows;
        if (calendars) {
            return {status: true, calendars: calendars};
        }
        else return {status: false};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function getCalendar(id) {
    try {
        const result = await pool.query("SELECT * FROM calendar_events WHERE calendar_id = $1", [id]);
        const calendar_events = result.rows;
        if (calendar_events) {
            return {status: true, events: calendar_events};
        }
        else return {status: false};
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function createCalendar(user_id, name, description, is_default) {
    try {
        const result = await pool.query("SELECT 1 FROM calendars WHERE user_id = $1 AND name = $2", [user_id, name]);
        if (result && result.rowCount > 0) {
            return {status: false, message: "Calendar already exists"};
        }
        else {
            const create = await pool.query(`INSERT INTO calendars (user_id, name, description, is_default) 
            VALUES ($1, $2, $3, $4)`, [user_id, name, description, is_default]);
            return {status: true, message: "Calendar successfully created"};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function createEvent(calendar_id, name, description, start_time, end_time, all_day, 
    recurrence, recurrence_start, recurrence_end) {
    try {
        const result = await pool.query(`SELECT 1 FROM calendar_events WHERE calendar_id = $1 AND name = $2
            AND description = $3 AND start_time = $4 AND all_day = $5 AND recurrence = $6`, [calendar_id, name, description,
                start_time, all_day, recurrence]);
        if (result && result.rowCount > 0) {
            return {status: false, message: "A similar event already exists"};
        }
        else {
            end_time = (end_time === undefined) ? null : end_time;
            recurrence_start = (recurrence_start  === undefined) ? null : recurrence_start;
            recurrence_end = (recurrence_end === undefined) ? null : recurrence_end;
            const create = await pool.query(`INSERT INTO calendar_events (calendar_id, name, description, start_time,
            end_time, all_day, recurrence, recurrence_start, recurrence_end) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [calendar_id, name, description, start_time, end_time, all_day,
                recurrence, recurrence_start, recurrence_end]);
            return {status: true, message: "Event successfully created"};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
}
module.exports = {getCalendars, getCalendar, createCalendar, createEvent};