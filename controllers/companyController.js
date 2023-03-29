const pool = require("../config/dbCon");

const createNewCompany = async (req, res, next) => {
    const { name, email, address } = req.body;
    try {
        // CHECK USER COMPANY
        const hasCompany = await (
            await pool.query("SELECT company_id FROM users WHERE id=$1", [
                req.user,
            ])
        ).rows[0].company_id;

        if (hasCompany)
            return res.status(406).json({ message: "Your company exists" });

        // CHECK TO DUPLICATE
        const checkEmail = await pool.query(
            "SELECT name FROM emails WHERE name=$1",
            [email]
        );

        const checkName = await pool.query(
            "SELECT name FROM company WHERE name=$1",
            [name]
        );

        if (checkEmail.rows[0])
            return res.status(409).json({
                message: "This email is already in use by another account",
            });
        else if (checkName.rows[0]) {
            return res.status(409).json({
                message: `This name is already in use by another account`,
            });
        }

        // STORE EMAIL TO DB AND GET ID
        await pool.query("INSERT INTO emails(name) VALUES($1)", [email]);
        const newEmailId = await (
            await pool.query("SELECT id FROM emails WHERE name=$1", [email])
        ).rows[0].id;

        // STORE NEW COMPANY
        await pool.query(
            "INSERT INTO Company(name, email_id, address, created_by) VALUES($1, $2, $3, $4)",
            [name, newEmailId, address, req.user]
        );

        // STORE NEW COMPANY ID TO USER
        const newCompanyId = await (
            await pool.query("SELECT id FROM company WHERE name=$1", [name])
        ).rows[0].id;

        await pool.query("UPDATE Users SET company_id=$1 WHERE id=$2", [
            newCompanyId,
            req.user,
        ]);

        res.status(201).json({ message: `New ${name} company created!` });
    } catch (err) {
        next(err);
    }
};

const getAllCompany = async (req, res) => {
    const companyList = await pool.query("SELECT * FROM company");
    res.status(200).json(companyList.rows);
};

module.exports = { createNewCompany, getAllCompany };
