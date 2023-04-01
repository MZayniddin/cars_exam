const pool = require("../config/dbCon");
const bcrypt = require("bcrypt");

const signIn = async (req, res, next) => {
    const { username, password, email, age } = req.body;
    if (!username || !password || !email || !age)
        return res.status(400).json({
            message:
                "Each space: User name, password, email and age are required!",
        });

    try {
        // CHECK USER TO DUPLICATE
        const foundUser = await pool.query(
            "select name from emails where name=$1",
            [email]
        );

        if (foundUser.rows[0])
            return res
                .status(409)
                .json({ message: "This email already signed in!" });

        // STORE EMAIL TO DB AND GET EMAIL ID
        await pool.query("INSERT INTO Emails(name) VALUES ($1)", [email]);
        const emailId = await (
            await pool.query("SELECT * FROM Emails WHERE name=$1", [email])
        ).rows[0].id;

        // ENCRYPT THE PASSWORD
        const hashedPwd = await bcrypt.hash(password, 10);

        // STORE NEW USER TO DB
        pool.query(
            "INSERT INTO Users(name, email_id, age, password) VALUES($1, $2, $3, $4)",
            [username, emailId, age, hashedPwd]
        );

        res.status(201).json({
            message: `User ${username} successfully registered!`,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { signIn };
