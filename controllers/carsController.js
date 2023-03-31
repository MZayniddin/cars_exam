const pool = require("../config/dbCon");

const createNewCar = async (req, res) => {
    res.send("OK");
};

module.exports = { createNewCar };
