import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { isValidDateRange } from "../utils/dateUtils";
import useFetchDoctorsAndPatients from "../hooks/useFetchDoctorsAndPatients";
import useAppointmentForm from "../hooks/useAppointmentForm";
import AppointmentForm from "./appointmentForm";

const EditAppointment = () => {
    const { id } = useParams();
    const { doctors, patients } = useFetchDoctorsAndPatients();
    const { formData, onFormChange } = useAppointmentForm({
        startDateTime: "",
        endDateTime: "",
        comment: "",
        selectedDoctorId: "",
        selectedPatientId: "",
    });

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/appointment/getOne/${id}`);
                const result = await response.json();
                if (result.success) {
                    onFormChange("startDateTime", result.data.startDateTime);
                    onFormChange("endDateTime", result.data.endDateTime);
                    onFormChange("comment", result.data.comments);
                    onFormChange("selectedDoctorId", result.data.doctorId);
                    onFormChange("selectedPatientId", result.data.patientId);
                } else{
                    alert("Error loading appointment details:", result.error);
                }
            } catch (error) {
                alert("Error loading appointment details:", error.message);
            }
        };

        fetchAppointmentDetails();
    }, [id]);

    const editAppointment = async (e) => {
        e.preventDefault();
        if (!isValidDateRange(formData.startDateTime, formData.endDateTime)) return;

        try {
            const result = await fetch(
                `http://localhost:3000/appointment/edit/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: { "Content-Type": "application/json" },
                }
            );
            const response = await result.json();
            alert(response.message);
        } catch (error) {
            alert("Error editing appointment: " + error.message);
        }
    };

    return (
        <div className="main-div">
            <AppointmentForm
                doctors={doctors}
                patients={patients}
                formData={formData}
                onFormChange={onFormChange}
                onSubmit={editAppointment}
                buttonText="Edit Appointment"
            />
        </div>
    );
};

export default EditAppointment;
