const pool = require("../config/dbCon");

const getCustomer = async (req, res) => {
    const { userId } = req.params;
    // CHECK CUSTOMER EXISTS
    const foundUser = await (
        await pool.query("SELECT * FROM Users WHERE id=$1", [userId])
    ).rows[0];

    if (!foundUser)
        return res.status(400).json({ message: `User ID ${userId} not found` });

    const result = await (
        await pool.query(
            "SELECT u.id as user_id, u.name, e.name as email, u.age, u.role, cars.name as purchased_car, com.name as seller, c.created_at as date FROM Users u JOIN Customers c ON c.user_id=u.id JOIN Emails e on e.id=u.email_id JOIN Cars on cars.id=c.car_id JOIN Company com on com.id=c.company_id WHERE u.id=$1",
            [userId]
        )
    ).rows;

    res.json(result);
};

module.exports = { getCustomer };
