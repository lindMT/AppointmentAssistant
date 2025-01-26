const express = require("express");
const db = require("../database/dbConfig");
const router = express.Router();

router.post("/getRange", (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        var startDateTime = new Date(startDate);
        var endDateTime = new Date(endDate);

        startDateTime.setUTCHours(0, 0, 0, 0);
        endDateTime.setUTCHours(23, 59, 59, 999);

        const formattedStartDateTime = startDateTime.toISOString();
        const formattedEndDateTime = endDateTime.toISOString();

        const getRangeAppointmentsSql = `
            SELECT
                appointments.*,
                doctor.firstName AS doctorFirstName,
                doctor.lastName AS doctorLastName,
                doctor.email AS doctorEmail,
                patient.firstName AS patientFirstName,
                patient.lastName AS patientLastName,
                patient.email AS patientEmail
            FROM appointments
            INNER JOIN users AS doctor 
                ON appointments.doctorId = doctor.id
            INNER JOIN users AS patient 
                ON appointments.patientId = patient.id
            WHERE
                (appointments.startDateTime >= ? AND appointments.endDateTime <= ?)
        `;

        db.all(
            getRangeAppointmentsSql, 
            [formattedStartDateTime, formattedEndDateTime], 
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

router.post("/book", async (req, res) => {
    try {
        const { startDateTime, endDateTime, selectedDoctorId, selectedPatientId, comment } = req.body;
        let conflicts = "There are conflicts with:\n";
        let hasConflict = false;

        const checkOverlapSql = `
            SELECT 
                appointments.*,
                doctor.firstName AS doctorFirstName,
                doctor.lastName AS doctorLastName,
                patient.firstName AS patientFirstName,
                patient.lastName AS patientLastName
            FROM appointments
            INNER JOIN users AS doctor 
                ON appointments.doctorId = doctor.id
            INNER JOIN users AS patient 
                ON appointments.patientId = patient.id
            WHERE 
                (appointments.doctorId = ? OR appointments.patientId = ?)
                AND appointments.startDateTime < ?
                AND appointments.endDateTime > ?
        `;

        const overlappingAppointments = await new Promise((resolve, reject) => {
            db.all(
                checkOverlapSql,
                [selectedDoctorId, selectedPatientId, endDateTime, startDateTime],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        overlappingAppointments.forEach(row => {
            hasConflict = true;
            const startTime = new Date(row.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            const endTime = new Date(row.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            conflicts += `Dr. ${row.doctorFirstName} ${row.doctorLastName} and ` +
                         `${row.patientFirstName} ${row.patientLastName}` +
                         ` (${startTime} to ${endTime})\n`;
        });
        

        if (hasConflict) {
            return res.json({
                status: 409,
                success: false,
                message: conflicts
            });
        }

        // Proceed with booking the appointment
        const insertAppointmentSql = 
            `INSERT INTO appointments (startDateTime, endDateTime, doctorId, patientId, comments) VALUES (?, ?, ?, ?, ?)`;
        db.run(
            insertAppointmentSql, 
            [startDateTime, endDateTime, selectedDoctorId, selectedPatientId, comment], 
            (err) => {
                if (err) {
                    console.log(err.message);
                    return res.json({ status: 500, success: false, error: err.message });
                }

                return res.json({
                    status: 200,
                    success: true,
                    message: "Appointment made successfully."
                });
            }
        );
    } catch (err) {
        return res.json({
            status: 500,
            success: false,
            message: err.message
        });
    }
});


router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    const deleteQuery = `DELETE FROM appointments WHERE id = ?`;

    db.run(deleteQuery, [id], function (err) {
        console.log('deleted '+ id);
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, error: err.message });
        }

        if (this.changes > 0) {
            return res.status(200).json({ success: true, message: "Appointment deleted successfully." });
        } else {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
    });
});

router.get("/getOne/:id", (req, res) => {
    const { id } = req.params;

    const getQuery = `SELECT * FROM appointments WHERE id = ?`;

    db.get(getQuery, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (row) {
            return res.status(200).json({ success: true, data: row });
        } else {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
    });
});

router.post("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { startDateTime, endDateTime, selectedDoctorId, selectedPatientId, comment } = req.body;

    // Check for overlapping appointments
    let conflicts = "There are conflicts with:\n";
    let hasConflict = false;

    const checkOverlapSql = `
        SELECT 
            appointments.*,
            doctor.firstName AS doctorFirstName,
            doctor.lastName AS doctorLastName,
            patient.firstName AS patientFirstName,
            patient.lastName AS patientLastName
        FROM appointments
        INNER JOIN users AS doctor 
            ON appointments.doctorId = doctor.id
        INNER JOIN users AS patient 
            ON appointments.patientId = patient.id
        WHERE 
            (appointments.doctorId = ? OR appointments.patientId = ?)
            AND appointments.startDateTime < ?
            AND appointments.endDateTime > ?
            AND appointments.id != ?
    `;

    const overlappingAppointments = await new Promise((resolve, reject) => {
        db.all(
            checkOverlapSql,
            [selectedDoctorId, selectedPatientId, endDateTime, startDateTime, id],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });

    overlappingAppointments.forEach(row => {
        hasConflict = true;
        const startTime = new Date(row.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const endTime = new Date(row.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        conflicts += `Dr. ${row.doctorFirstName} ${row.doctorLastName} and ` +
                     `${row.patientFirstName} ${row.patientLastName}` +
                     ` (${startTime} to ${endTime})\n`;
    });
    

    if (hasConflict) {
        return res.json({
            status: 409,
            success: false,
            message: conflicts
        });
    }


    // PROCEED
    const updateAppointmentSql = `
        UPDATE appointments
        SET startDateTime = ?, endDateTime = ?, doctorId = ?, patientId = ?, comments = ?
        WHERE id = ?
    `;
    db.run(
        updateAppointmentSql,
        [startDateTime, endDateTime, selectedDoctorId, selectedPatientId, comment, id],
        (err) => {
            if (err) {
                console.error(err.message);
                return res.json({ status: 500, success: false, error: err.message });
            }

            return res.json({
                status: 200,
                success: true,
                message: "Appointment updated successfully."
            });
        }
    );
});

module.exports = router;