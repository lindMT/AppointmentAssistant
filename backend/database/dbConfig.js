const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Database opened successfully');
        
        createTables();
    }
});

const createAppointmentsTableSql = `
    CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
        startDateTime DATETIME NOT NULL,
        endDateTime DATETIME NOT NULL,
        doctorId TEXT NOT NULL,
        patientId TEXT NOT NULL,
        comments TEXT NOT NULL
    )`;
    
const createUserTypesTableSql = `
    CREATE TABLE IF NOT EXISTS userTypes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        typeName TEXT NOT NULL
    )`;

// UUID generator code snippet from: https://database.guide/how-randomblob-works-in-sqlite/
const createUsersTableSql = `
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE,
        userType INTEGER NOT NULL
    )`;

function createTables() {
    // Appointments
    db.serialize(() => {
        db.run(createAppointmentsTableSql, (err) => {
            if (err) {
                console.error("Error creating appointments table:", err.message);
            } else {
                console.log("Appointments table created successfully.");
            }
        });
    });

    // User Types
    db.serialize(() => {
        db.run(createUserTypesTableSql, (err) => {
            if (err) {
                console.error("Error creating user types table:", err.message);
            } else {
                console.log("User types table created successfully.");

                // Insert default user types (0 for patient, 1 for doctor)
                const insertUserTypesSql = `
                    INSERT INTO userTypes (typeName)
                    VALUES ('Patient'), ('Doctor')`;
                db.run(insertUserTypesSql, (err) => {
                    if (err) return console.error("Error inserting user types:", err.message);
                    console.log("Default user types inserted successfully.");
                });
            }
        });
    });

    // User Table
    db.serialize(() => {
        db.run(createUsersTableSql, (err) => {
            if (err) {
                console.error("Error creating user table:", err.message);
            } else {
                console.log("User table created successfully.");
            }
        });
    });

}


module.exports = db;
