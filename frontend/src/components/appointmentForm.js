import React from "react";
import { currentLocalTime } from "../utils/dateUtils";

const AppointmentForm = ({
    doctors,
    patients,
    formData,
    onFormChange,
    onSubmit,
    buttonText,
}) => {
    const {
        startDateTime,
        endDateTime,
        comment,
        selectedDoctorId,
        selectedPatientId,
    } = formData;

    return (
    <form onSubmit={onSubmit}>
        <h2>Book an Appointment</h2> <br />
        <div className="form-grid">
            <label>Doctor:</label>
            <select
                value={selectedDoctorId}
                onChange={(e) => onFormChange("selectedDoctorId", e.target.value)}
                required
            >
                <option value="" disabled>
                    Select a Doctor
                </option>
                {doctors.map((doctor) => (
                    <option key={doctor.userId} value={doctor.userId}>
                    {doctor.lastName}, {doctor.firstName} ({doctor.email})
                    </option>
                ))}
            </select>

            <label>From:</label>
            <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => onFormChange("startDateTime", e.target.value)}
                min={currentLocalTime()}
                required
            />

            <label>Patient:</label>
            <select
                value={selectedPatientId}
                onChange={(e) => onFormChange("selectedPatientId", e.target.value)}
                required
            >
                <option value="" disabled>
                    Select a Patient
                </option>
                {patients.map((patient) => (
                    <option key={patient.userId} value={patient.userId}>
                    {patient.lastName}, {patient.firstName} ({patient.email})
                    </option>
                ))}
            </select>

            <label>To:</label>
            <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => onFormChange("endDateTime", e.target.value)}
                min={currentLocalTime()}
                required
            />

            <label style={{ gridColumn: "3" }}>Comments:</label>
            <textarea
                value={comment}
                onChange={(e) => onFormChange("comment", e.target.value)}
                style={{ gridColumn: "4", height: "4rem" }}
                required
            />

            <button 
                type="submit" 
                style={{ gridColumn: "4" }}
                disabled={!selectedDoctorId || !selectedPatientId || !startDateTime || !endDateTime || !comment}>
                {buttonText}
            </button>
        </div>
    </form>
  );
};

export default AppointmentForm;