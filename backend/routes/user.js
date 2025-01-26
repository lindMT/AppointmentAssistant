const express = require("express");
const db = require("../database/dbConfig");
const router = express.Router();

router.post("/registerUser", (req, res) => {
    try {
        const { firstName, lastName, email, userType } = req.body;
        const lowerCaseEmail = email.toLowerCase();

        // Check if the email already exists in the database
        // (use case for emails is for people with the same name)
        const checkEmailSql = `SELECT * FROM users WHERE email = ?`;

        db.get(
            checkEmailSql, 
            [lowerCaseEmail], 
            (err, row) => {
                if (err) {
                    return res.json({ status: 500, success: false, error: err.message });
                }

                // If the email exists, return an error message
                if (row) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "Email already exists."
                    });
                }

                const insertUserSql = `INSERT INTO users (firstName, lastName, email, userType) VALUES ( ?, ?, ?, ?)`;
                db.run(
                    insertUserSql, 
                    [firstName, lastName, lowerCaseEmail, userType], 
                    (err) => {
                        if (err) {
                            console.log(err.message);
                            return res.json({ status: 500, success: false, error: err.message });
                        }

                        return res.json({
                            status: 201,
                            success: true,
                            message: "User registered successfully."
                        });
                    }
                );
            }
        );
    } catch (err) {
        console.log(err.message);
        return res.json({
            status: 400,
            success: false,
            message: err.message
        });
    }
});

router.get("/getAllUsers", (req, res) => {
    try {
        const getAllSql = `
            SELECT 
                users.id AS userId, 
                users.firstName, 
                users.lastName, 
                users.email, 
                userTypes.id AS userTypeId, 
                userTypes.typeName 
            FROM users 
            INNER JOIN userTypes 
            ON users.userType = userTypes.id
        `;

        db.all(
            getAllSql, 
            [], 
            (err, rows) => {
                if (err) {
                    return res.json({ status: 500, success: false, error: err.message });
                } else {
                    return res.json({
                        status: 200,
                        success: true,
                        data: rows
                    });
                }
            }
        );

    } catch (err) {
        console.log(err.message);
        return res.json({
            status: 400,
            success: false,
            message: err.message
        });
    }
});

router.get("/getAllUserTypes", (req, res) => {
    try {
        const getUserTypesSql = `
            SELECT *
            FROM userTypes
        `;

        db.all(
            getUserTypesSql, 
            [], 
            (err, rows) => {
                if (err) {
                    console.log("PAYB HANDARED: " + err.message);
                    return res.json({ status: 500, success: false, error: err.message });
                } else {
                    return res.json({
                        status: 200,
                        success: true,
                        data: rows
                    });
                }
            }
        );

    } catch (err) {
        console.log(err.message);
        return res.json({
            status: 400,
            success: false,
            message: err.message
        });
    }
});


module.exports = router;