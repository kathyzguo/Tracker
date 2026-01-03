const express = require("express");
const router = express.Router();
const {getDefault} = require("../controllers/calendarController");

router.use(express.json());

router.post("/getDefault", async (req, res) => {
    const id = req.body;
    const defaultCalendar = await getDefault(id.id);
    res.json(defaultCalendar);
    });

module.exports = router;