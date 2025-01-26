import React from "react";
import { isValidDateRange } from "../utils/dateUtils";
import useFetchDoctorsAndPatients from "../hooks/useFetchDoctorsAndPatients";
import useAppointmentForm from "../hooks/useAppointmentForm";
import AppointmentForm from "./appointmentForm";

const BookAppointments = () => {
    const { doctors, patients } = useFetchDoctorsAndPatients();
    const { formData, onFormChange } = useAppointmentForm({
        startDateTime: "",
        endDateTime: "",
        comment: "",
        selectedDoctorId: "",
        selectedPatientId: "",
    });

    const bookAppointment = async (e) => {
        e.preventDefault();

        if (!isValidDateRange(formData.startDateTime, formData.endDateTime)) return;

        try {
            const result = await fetch("http://localhost:3000/appointment/book", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });
            
            const response = await result.json();
            alert(response.message);
        } catch (error) {
            alert("Error booking appointment: " + error.message);
        }
    };

    return (
        <div className="main-div">
            <AppointmentForm
                doctors={doctors}
                patients={patients}
                formData={formData}
                onFormChange={onFormChange}
                onSubmit={bookAppointment}
                buttonText="Book Appointment"
            />
        </div>
    );
};

export default BookAppointments;
