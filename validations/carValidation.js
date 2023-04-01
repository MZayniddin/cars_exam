const Joi = require("joi");

const carValidation = async (req, res, next) => {
    const { name, color, brand } = req.body;
    name ? (req.body.name = name.trim()) : null;
    color ? (req.body.color = color.trim()) : null;
    brand ? (req.body.brand = brand.trim()) : null;

    const schema = Joi.object({
        name: Joi.string().min(2).max(30),
        price: Joi.number().min(100).max(2000000),
        color: Joi.string().alphanum().min(3).max(20),
        brand: Joi.string().min(2).max(30),
    });

    try {
        const result = await schema.validateAsync(req.body);
        if (result) next();
    } catch (err) {
        res.status(406).json({ message: err.details[0].message });
    }
};

module.exports = carValidation;
