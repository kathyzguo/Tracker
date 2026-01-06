const bcrypt = require("bcryptjs");
const pool = require("./db");

async function checkUsers(em, pw) {
    try {
        const result = await pool.query("SELECT * FROM users WHERE UPPER(email) = UPPER($1)", [em]);
        const rightUser = result.rows[0];
        if (rightUser) {
            const rightPassword = await bcrypt.compare(pw, rightUser.password);
            return (rightPassword) ? {status: true, id: rightUser.id, message: "Success"} : 
            {status: false, id: rightUser.id, message: "Wrong Password"};
        }
        else {
            return {status: false, message: "Not Registered Email"};
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
}

async function addUser(nm, em, pw) {
    try {
        const hashed = await bcrypt.hash(pw, 10);
        const result = await pool.query("SELECT 1 FROM users WHERE UPPER(email) = UPPER($1)", [em]);
        if (!result.rows[0]) {
            const user = await pool.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3)`, [nm, hashed, em]);
            return {status: true, message: "User Successfully Registered"}
        }
        else {
            return {status: false, message: "Email Already Registered"}
        }
    }
    catch (err) {
        console.log("Error:", err);
    }
}

module.exports = {checkUsers, addUser}