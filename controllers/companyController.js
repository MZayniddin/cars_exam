const pool = require("../config/dbCon");

const createNewCompany = async (req, res, next) => {
    const { name, email, address } = req.body;
    if (!name || !email || !address)
        return res.status(400).json({
            message:
                "Each space: Company name, email and address are required!",
        });

    try {
        // CHECK USER COMPANY
        const hasCompany = await (
            await pool.query("SELECT company_id FROM users WHERE id=$1", [
                req.user,
            ])
        ).rows[0].company_id;

        if (hasCompany)
            return res
                .status(406)
                .json({ message: "You have another company" });

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

const getCompany = async (req, res) => {
    const { companyId } = req.params;
    const foundCompany = await pool.query("SELECT * FROM company WHERE id=$1", [
        companyId,
    ]);

    if (foundCompany.rows[0]) return res.json(foundCompany.rows[0]);

    res.status(400).json({ message: `Company ID ${companyId} not found` });
};

const updateCompany = async (req, res) => {
    let { name, address, email } = req.body;
    const { companyId } = req.params;

    // CHECK COMPANY EXISTS
    const foundCompany = await (
        await pool.query("SELECT * FROM Company WHERE id=$1", [companyId])
    ).rows[0];

    if (!foundCompany)
        return res
            .status(400)
            .json({ message: `Company ID ${companyId} not found!` });

    // UPDATE EMAIL IF EXISTS
    if (email) {
        const checkEmail = await (
            await pool.query("SELECT name FROM Emails WHERE name=$1", [email])
        ).rowCount;
        if (checkEmail)
            return res.status(406).json({
                message: "This email is already in use by another account",
            });

        await pool.query("UPDATE Emails SET name=$1 WHERE id=$2", [
            email,
            foundCompany.email_id,
        ]);
    }

    // UPDATE COMPANY DATA
    name = name ? name : foundCompany.name;
    address = address ? address : foundCompany.address;

    try {
        const updatedCompanyData = await pool.query(
            "UPDATE Company SET name=$1, address=$2 WHERE id=$3 RETURNING *",
            [name, address, companyId]
        );
        res.status(202).json(updatedCompanyData.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createNewCompany, getAllCompany, getCompany, updateCompany };
