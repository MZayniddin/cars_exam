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
        await pool.query(
            "SELECT c.id, c.name, c.price, c.color, c.brand, u.name as created_by, co.name as company FROM Cars c JOIN Company co ON co.id=c.company_id JOIN Users u ON u.id=c.created_by WHERE c.id=$1",
            [carId]
        )
    ).rows[0];

    if (!foundCar)
        return res.status(400).json({ message: `Car ID ${carId} not found` });

    res.send(foundCar);
};

const updateCar = async (req, res) => {
    const { carId } = req.params;
    let { name, price, color, brand } = req.body;

    // CHECK CAR EXISTS
    const foundCar = await (
        await pool.query("SELECT * FROM Cars WHERE id=$1", [carId])
    ).rows[0];

    if (!foundCar)
        return res.status(400).json({ message: `Car ID ${carId} not found` });

    // CHECK USER'S CAR
    if (foundCar.company_id !== req.companyId)
        return res.status(403).json({ message: "It's not your car" });

    // UPDATE CAR DATA
    name = name ? name : foundCar.name;
    price = price ? price : foundCar.price;
    color = color ? color : foundCar.color;
    brand = brand ? brand : foundCar.brand;

    const updatedCar = await pool.query(
        "UPDATE Cars SET name=$1, price=$2, color=$3, brand=$4 WHERE id=$5 RETURNING *",
        [name, price, color, brand, carId]
    );

    res.status(202).json(updatedCar.rows[0]);
};

const deleteCar = async (req, res) => {
    const { carId } = req.params;

    // CHECK CAR EXISTS
    const foundCar = await pool.query("SELECT * FROM cars WHERE id=$1", [
        carId,
    ]);

    if (!foundCar.rows[0])
        return res.status(400).json({ message: `Car ID ${carId} not found` });

    // CHECK USER'S CAR
    if (foundCar.rows[0].company_id !== req.companyId)
        return res.status(403).json({ message: "It's not your car" });

    // DELETE CAR FROM DB
    await pool.query("DELETE FROM Cars WHERE id=$1", [carId]);

    res.json(foundCar.rows[0]);
};

const getCarsOfCompany = async (req, res) => {
    const { companyId } = req.params;

    // GET CARS OF COMPANY
    const result = await (
        await pool.query(
            "SELECT c.id, c.name, c.price, c.color, c.brand, u.name as created_by, c.is_purchased FROM Cars c JOIN Company co ON c.company_id=co.id JOIN Users u ON c.created_by=u.id WHERE co.id=$1",
            [companyId]
        )
    ).rows;

    if (!result[0])
        return res
            .status(400)
            .json({ message: `Company ID ${companyId} not found!` });

    res.json(result);
};

const buyCar = async (req, res) => {
    const { carId } = req.params;

    // CHECK CAR EXISTS
    const foundCar = await (
        await pool.query("SELECT * FROM cars WHERE id=$1", [carId])
    ).rows[0];

    if (!foundCar)
        return res.status(400).json({ message: `Car ID ${carId} not found` });

    // STORE CUSTOMER DATA
    await pool.query(
        "INSERT INTO Customers(user_id, car_id, company_id) VALUES($1, $2, $3)",
        [req.user, foundCar.id, foundCar.company_id]
    );

    // CHANGE CAR STATE
    await pool.query("UPDATE Cars SET is_purchased=$1 WHERE id=$2", [
        true,
        foundCar.id,
    ]);

    res.json({ message: `Car ${foundCar.name} was purchased` });
};

module.exports = {
    createNewCar,
    getCarsList,
    getOneCar,
    updateCar,
    deleteCar,
    buyCar,
    getCarsOfCompany,
};
