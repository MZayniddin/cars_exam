const Joi = require("joi");

const companyValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "ru", "net"] },
            })
            .required(),
        address: Joi.string().min(5).max(40).required(),
    });

    try {
        const result = await schema.validateAsync(req.body);
        if (result) next();
    } catch (err) {
        res.status(406).json({ message: err.details[0].message });
    }
};

module.exports = companyValidation;
