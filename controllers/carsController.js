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

    //STORE NEW CAR DATA TO DB
    await pool.query(
        "INSERT INTO Cars(name, price, color, brand, created_by, company_id) VALUES($1, $2, $3, $4, $5, $6)",
        [name, price, color, brand, req.user, req.companyId]
    );

    res.status(201).json({ message: `New car ${name} created!` });
};

const getCarsList = async (req, res) => {
    const allCars = await pool.query("SELECT * FROM Cars");
    res.json(allCars.rows);
};

const getOneCar = async (req, res) => {
    const { carId } = req.params;

    const foundCar = await (
        await pool.query("SELECT * FROM Cars WHERE id=$1", [carId])
    ).rows[0];

    if (!foundCar)
        return res.status(400).json({ message: `Car ID ${carId} not found` });

    res.send(foundCar);
};

module.exports = { createNewCar, getCarsList, getOneCar };
