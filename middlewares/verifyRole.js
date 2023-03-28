const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        const role = req.role;
        if (!role) return res.sendStatus(401);
        if (!allowedRoles.includes(role))
            return res.status(403).json({ message: "No access for this role" });
        next();
    };
};

module.exports = verifyRole;
