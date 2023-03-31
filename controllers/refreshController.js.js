const jwt = require("jsonwebtoken");
const pool = require("../config/dbCon");

const handleRefreshToken = async (req, res) => {
    if (!req.cookies?.jwt) return res.sendStatus(401);
    const refreshToken = req.cookies.jwt;
    // FOUND USER
    const foundUser = await (
        await pool.query("SELECT * FROM Users WHERE refresh_token=$1", [
            refreshToken,
        ])
    ).rows[0];

    if (!foundUser) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
        if (err || decoded.id !== foundUser.id) return res.sendStatus(403);

        // CREATE NEW ACCESS TOKEN
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

        res.json({ accessToken });
    });
};

module.exports = { handleRefreshToken };
