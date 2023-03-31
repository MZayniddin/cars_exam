const jwt = require("jsonwebtoken");
const bcypt = require("bcrypt");
const pool = require("../config/dbCon");

const signUp = async (req, res, next) => {
    const { email, password } = req.body;

    // CHECK USER WAS EXISTS
    const emailId = await (
        await pool.query("SELECT id FROM Emails WHERE name=$1", [email])
    ).rows[0]?.id;

    if (!emailId)
        return res.status(401).json({ message: "User is not registered yet" });

    // FIND USER
    const foundUser = await (
        await pool.query("SELECT * FROM Users WHERE email_id=$1", [emailId])
    ).rows[0];

    if (!foundUser)
        return res.status(401).json({ message: "User is not registered yet" });

    // CHECK PASSWORD
    const isPwdCorrect = await bcypt.compare(password, foundUser.password);

    if (!isPwdCorrect)
        return res.status(401).json({ message: "Incorrect password" });

    // CREATE TOKENS
    const accessToken = jwt.sign(
        {
            id: foundUser.id,
            role: foundUser.role,
        },
        process.env.ACCESS_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TIME,
        }
    );

    const refreshToken = jwt.sign(
        {
            id: foundUser.id,
        },
        process.env.REFRESH_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TIME,
        }
    );

    // SAVING USER'S REFRESH TOKEN
    await pool.query("UPDATE Users SET refresh_token=$1 WHERE id=$2", [
        refreshToken,
        foundUser.id,
    ]);

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 100,
    });

    res.status(200).json({ accessToken });
};

module.exports = { signUp };
