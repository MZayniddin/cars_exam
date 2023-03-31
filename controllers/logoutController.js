const pool = require("../config/dbCon");

const handleLogout = async (req, res) => {
    res.send("OK");
};

module.exports = { handleLogout };
