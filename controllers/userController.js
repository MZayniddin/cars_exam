const pool = require("../config/dbCon");

const getCustomer = async (req, res) => {
    const { userId } = req.params;
    // CHECK USER EXISTS
    const foundUser = await (
        await pool.query("SELECT * FROM Users WHERE id=$1", [userId])
    ).rows[0];

    if (!foundUser)
        return res.status(400).json({ message: `User ID ${userId} not found` });

    // GET PURCHASED DATA
    const result = await (
        await pool.query(
            "SELECT u.id as user_id, u.name, e.name as email, u.age, u.role, cars.name as purchased_car, cars.brand as car_brand, com.name as seller, c.created_at as date FROM Customers c JOIN Users u  ON c.user_id=u.id JOIN Emails e on e.id=u.email_id JOIN Cars on cars.id=c.car_id JOIN Company com on com.id=c.company_id WHERE u.id=$1",
            [userId]
        )
    ).rows;

    res.json(result);
};

const getUserActivity = async (req, res) => {
    const { userId } = req.params;
    // CHECK USER EXISTS
    const foundUser = await (
        await pool.query("SELECT * FROM Users WHERE id=$1", [userId])
    ).rows[0];

    if (!foundUser)
        return res.status(400).json({ message: `User ID ${userId} not found` });

    // GET USER'S ACTIVITY DATA
    const result = await (
        await pool.query(
            "SELECT u.id, u.name, u.age, u.email_id, u.role, u.company_id, s.started_at, s.ended_at FROM Session s JOIN Users u ON s.user_id=u.id WHERE u.id=$1",
            [userId]
        )
    ).rows;

    res.json(result);
};

const getUsersOfCompany = async (req, res) => {
    const { companyId } = req.params;

    // CHECK COMPANY EXISTS
    const foundCompany = await (
        await pool.query("SELECT * FROM Company WHERE id=$1", [companyId])
    ).rows[0];

    if (!foundCompany)
        return res
            .status(400)
            .json({ message: `Company ID ${companyId} not found!` });

    // GET USERS
    const result = await (
        await pool.query(
            "SELECT u.id, u.name, u.age, u.email_id, u.role, u.company_id FROM Users u JOIN Company c ON u.company_id=c.id WHERE c.id=$1",
            [companyId]
        )
    ).rows;

    res.json(result);
};

module.exports = { getCustomer, getUserActivity, getUsersOfCompany };
