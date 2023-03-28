module.exports = (err, req, res, next) => {
    err.stack ? console.error(err.stack) : null;
    res.status(err.status || 500).json({ message: err.message });
};
