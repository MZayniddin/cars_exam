const pool = require("../config/dbCon");
const bcrypt = require("bcrypt");

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

    // GET USER'S ACTIVITY DATA
    const result = await (
        await pool.query(
            "SELECT u.id, u.name, u.age, u.email_id, u.role, u.company_id, s.started_at, s.ended_at FROM Session s JOIN Users u ON s.user_id=u.id WHERE u.id=$1",
            [userId]
        )
    ).rows;

    if (!result[0])
        return res.status(400).json({ message: `User ID ${userId} not found` });

    res.json(result);
};

const getUsersOfCompany = async (req, res) => {
    const { companyId } = req.params;

    // GET USERS
    const result = await (
        await pool.query(
            "SELECT u.id, u.name, u.age, u.email_id, u.role, u.company_id FROM Users u JOIN Company c ON u.company_id=c.id WHERE c.id=$1",
            [companyId]
        )
    ).rows;

    if (!result[0])
        return res
            .status(400)
            .json({ message: `Company ID ${companyId} not found!` });

    res.json(result);
};

const getUsersList = async (req, res) => {
    const usersList = await pool.query(
        "SELECT u.id, u.name, e.name as email, u.role, c.name as company FROM Users u JOIN Emails e ON u.email_id=e.id JOIN Company c ON u.company_id=c.id"
    );
    res.json(usersList.rows);
};

const updateProfile = async (req, res) => {
    let { username, password, email, age, new_password } = req.body;
    if (!password)
        return res.status(400).json({ message: "Password required!" });

    const foundUser = await (
        await pool.query("SELECT * FROM users WHERE id=$1", [req.user])
    ).rows[0];

    if (!foundUser)
        return res
            .status(400)
            .json({ message: `User ID ${req.user} not found!` });

    // CHECK PASSWORD
    const checkPwd = await bcrypt.compare(password, foundUser.password);

    if (!checkPwd)
        return res.status(401).json({ message: "Incorrect password" });

    // CHECK EMAIL AND UPDATE
    if (email) {
        const checkEmail = await (
            await pool.query("SELECT name FROM Emails WHERE name=$1", [email])
        ).rows[0];

        if (checkEmail)
            return res.status(406).json({
                message: "This email is already in use by another account",
            });

        await pool.query("UPDATE Emails SET name=$1 WHERE id=$2", [
            email,
            foundUser.email_id,
        ]);
    }

    // UPDATE USER DATA
    username = username ? username : foundUser.name;
    age = age ? age : foundUser.age;

    const updatedUserData = await pool.query(
        "UPDATE Users SET name=$1, age=$2 WHERE id=$3 RETURNING id, name, email_id, age",
        [username, age, req.user]
    );
    res.status(202).json(updatedUserData.rows[0]);

    if (new_password) {
        const newHashedPwd = await bcrypt.hash(new_password, 10);
        await pool.query("UPDATE Users SET password=$1 WHERE id=$2", [
            newHashedPwd,
            req.user,
        ]);
    }
};

const deleteUser = async (req, res) => {
    const { userId } = req.params;

    // CHECK USER EXISTS
    const foundUser = await pool.query("SELECT * FROM users WHERE id=$1", [
        userId,
    ]);

    if (!foundUser.rows[0])
        return res.status(400).json({ message: `User ID ${userId} not found` });

    // DELETE USER FROM DB
    await pool.query("DELETE FROM users WHERE id=$1", [userId]);
    await pool.query("DELETE FROM emails WHERE id=$1", [
        foundUser.rows[0].email_id,
    ]);

    res.status(200).json({
        message: `User ${foundUser.rows[0].name} deleted!`,
    });
};

module.exports = {
    getCustomer,
    getUserActivity,
    getUsersOfCompany,
    getUsersList,
    updateProfile,
    deleteUser,
};
