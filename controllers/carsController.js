const pool = require("../config/dbCon");

const createNewCar = async (req, res) => {
    const { name, price, color, brand } = req.body;
    if (!name || !price || !color || !brand)
        return res.status(400).json({
            message:
                "Each space: Car name, price, color and brand are required!",
        });

    // CHECK USER HAS COMPANY

    if (!req.companyId)
        return res
            .status(400)
            .json({ message: "First, you should create a company!" });
    
    res.send("OK")
};

module.exports = { createNewCar };
