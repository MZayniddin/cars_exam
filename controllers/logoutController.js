const pool = require("../config/dbCon");

const handleLogout = async (req, res) => {
    if (!req.cookies?.jwt) return res.sendStatus(204);
    const refreshToken = req.cookies.jwt;

    // CLEAR USER'S REFRESH TOKEN
    await pool.query(
        "UPDATE Users SET refresh_token='' WHERE refresh_token=$1",
        [refreshToken]
    );

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 100,
    });

    res.sendStatus(204);
};

module.exports = { handleLogout };
