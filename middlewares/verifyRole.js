const verifyRole = (allowedRole) => {
    return (req, res, next) => {
        const role = req.role;
        if (!role) return res.sendStatus(401);
        else if (allowedRole !== role) return res.sendStatus(403);
        else next();
    };
};

module.exports = verifyRole;
