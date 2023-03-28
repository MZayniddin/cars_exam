const Joi = require("joi");

const signUpValidation = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ["com", "net", "ru"] },
            })
            .required(),
        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
    });

    try {
        const result = await schema.validateAsync(req.body);
        if (result) next();
    } catch (err) {
        next({ message: err.details[0].message, status: 406 });
    }
};

module.exports = signUpValidation;
