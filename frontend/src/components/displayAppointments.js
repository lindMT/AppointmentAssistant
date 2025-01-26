import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../App.css';
import DynamicTable from "./dynamicTable";

const DisplayAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const columns = [
        {
            header: "Doctor",
            accessorFn: (row) => `${row.doctorLastName}, ${row.doctorFirstName} (${row.doctorEmail})`,
            cell: (info) => (
                <>
                    {info.row.original.doctorLastName}, {info.row.original.doctorFirstName}
                    <br />
                    <i>({info.row.original.doctorEmail})</i>
                </>
            ),
        },
        {
            header: "Patient",
            accessorFn: (row) => `${row.patientLastName}, ${row.patientFirstName} (${row.patientEmail})`,
            cell: (info) => (
                <>
                    {info.row.original.patientLastName}, {info.row.original.patientFirstName}
                    <br />
                    <i>({info.row.original.patientEmail})</i>
                </>
            ),
        },      
        {
            header: "Start Time",
            accessorKey: "startDateTime",
            cell: (info) => new Date(info.row.original.startDateTime).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' }),
            sortType: (rowA, rowB) => {
                const dateA = new Date(rowA.original.startDateTime);
                const dateB = new Date(rowB.original.startDateTime);
                return dateA - dateB;
            }
        },
        {
            header: "End Time",
            accessorKey: "endDateTime",
            cell: (info) => new Date(info.row.original.endDateTime).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' }),
            sortType: (rowA, rowB) => {
                const dateA = new Date(rowA.original.endDateTime);
                const dateB = new Date(rowB.original.endDateTime);
                return dateA - dateB;
            }
        },

        {
            header: "Comments",
            accessorKey: "comments",
        },
        {
            header: "Actions",
            cell: (info) => (
                <div>
                    <button onClick={() => handleDelete(info.row.original.id)}>Delete</button>
                    <Link to={`/editAppointment/${info.row.original.id}`}>
                        <button>Edit</button>
                    </Link>
                </div>
            ),
        },
    ];
    


    useEffect(() => {
        if (startDate && endDate) {
            const fetchData = async () => {
                try {
                    console.warn("Fetching appointments within the range");
                    const response = await fetch("http://localhost:3000/appointment/getRange", {
                        method: "POST",
                        body: JSON.stringify({
                            startDate: startDate,
                            endDate: endDate,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    const appointmentResult = await response.json();

                    if (appointmentResult.success) {
                        setAppointments(appointmentResult.data);
                    } else {
                        alert(appointmentResult.error);
                    }
                } catch (error) {
                    alert("Error fetching data: ", error.message);
                }
            };
            fetchData();
        }
    }, [startDate, endDate]);

    const handleDelete = async (appointmentId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/appointment/delete/${appointmentId}`,
                { method: 'DELETE' }
            );

            const result = await response.json();
            if (result.success) {
                // Remove the deleted appointment from the state
                setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
            } else {
                alert("Error deleting appointment: " + result.error);
            }
        } catch (error) {
            console.error("Error deleting appointment: ", error.message);
        }
    };

    return (
        <div
            className="main-div">            
            <h2>Display Appointments</h2><br/>
            <div
                style={{display: "flex", flexDirection: "row", gap: "1rem"}}>
                <label>From</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} 
                />
                <label> To </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)} 
                />
                <br />
            </div>
            
            <br />
            <DynamicTable data={appointments} columns={columns} tableTitle={""}/>
        </div>
    );
};

export default DisplayAppointments;