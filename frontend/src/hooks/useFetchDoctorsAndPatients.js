import { useState, useEffect } from "react";

const useFetchDoctorsAndPatients = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchDoctorsAndPatients = async () => {
            try {
                const result = await fetch("http://localhost:3000/user/getAllUsers");
                const resultData = await result.json();

                if (resultData.success) {
                    setDoctors(
                        resultData.data.filter(user => user.typeName === "Doctor")
                    );
                    setPatients(
                        resultData.data.filter(user => user.typeName === "Patient")
                    );
                    setUsers(resultData.data);
                } else {
                    console.error(resultData.error);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        
        fetchDoctorsAndPatients();
    }, []);
    
    return { doctors, patients, users , setDoctors, setPatients, setUsers};
};

export default useFetchDoctorsAndPatients;