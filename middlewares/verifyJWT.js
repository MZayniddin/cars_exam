const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
            if (err) res.sendStatus(401);
            req.user = decoded.id;
            req.role = decoded.role;
            req.companyId = decoded.company_id;
            next();
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = verifyJWT;
