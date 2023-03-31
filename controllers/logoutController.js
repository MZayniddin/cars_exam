const pool = require("../config/dbCon");
const format = require("date-fns/format");

const handleLogout = async (req, res) => {
    if (!req.cookies?.jwt) return res.sendStatus(204);
    const refreshToken = req.cookies.jwt;

    // FIND USER FOR STORE LOGOUT DATE
    const foundUser = await (
        await pool.query("SELECT id FROM Users WHERE refresh_token=$1", [
            refreshToken,
        ])
    ).rows[0];

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

    // STORE LOGOUT DATE TO DB
    await pool.query("UPDATE session SET ended_at=$1 WHERE user_id=$2", [
        format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        foundUser.id,
    ]);
};

module.exports = { handleLogout };
