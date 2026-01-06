const {Pool} = require("pg"); 
    
const pool = new Pool({
    connectionString: process.env.DBURL
});

module.exports = pool;