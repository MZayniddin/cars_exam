const Joi = require("joi");

const companyValidation = async (req, res, next) => {
    const { name, address } = req.body;
    name ? (req.body.name = name.trim()) : null;
    address ? (req.body.address = address.trim()) : null;

    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(30),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "ru", "net"] },
        }),
        address: Joi.string().min(5).max(40),
    });

    try {
        const result = await schema.validateAsync(req.body);
        if (result) next();
    } catch (err) {
        res.status(406).json({ message: err.details[0].message });
    }
};

module.exports = companyValidation;
