const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signIn = (req, res) => {
    const { username, password, email, age } = req.body;
    console.log("hello");
};

module.exports = { signIn };
