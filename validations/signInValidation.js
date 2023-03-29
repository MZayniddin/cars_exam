const Joi = require("joi");

const signInValidation = async (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().trim().min(3).max(20).required(),
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net", "ru"] },
            })
            .required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
        age: Joi.number().integer().min(7).max(120).required(),
    });

    try {
        const result = await schema.validateAsync(req.body);
        if (result) next();
    } catch (err) {
        next({ message: err.details[0].message, status: 406 });
    }
};

module.exports = signInValidation;
