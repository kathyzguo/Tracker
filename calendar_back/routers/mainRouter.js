const express = require("express");
const router = express.Router();
const {getName} = require("../controllers/mainController");

router.use(express.json());

router.post("/getName", async (req, res) => {
    const {id} = req.body;
    const userData = await getName(id);
    res.json(userData);
});

module.exports = router;
