import React, { useState, useEffect } from "react";
import useFetchDoctorsAndPatients from "../hooks/useFetchDoctorsAndPatients";
import DynamicTable from "./dynamicTable";

const RegisterUsers = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState(0);
    const { users, setUsers } = useFetchDoctorsAndPatients();
    const [userTypes, setUserTypes] = useState([]);

    useEffect(() => {
        const fetchUserTypes = async () => {
            try {                
                let userTypesResult = await fetch("http://localhost:3000/user/getAllUserTypes");
                userTypesResult = await userTypesResult.json();

                if (userTypesResult.success) {
                    setUserTypes(userTypesResult.data);
                } else {
                    alert(userTypesResult.error);
                }
            } catch (error) {
                alert("Error fetching user types:" + error.message);
            }
        };

        fetchUserTypes();
    }, []);

    const collectData = async (e) => {
        e.preventDefault();
        try {
            let result = await fetch("http://localhost:3000/user/registerUser", {
                method: "post",
                body: JSON.stringify({ firstName, lastName, email, userType }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            result = await result.json();
            alert(result.message);
            
            // If theres a new resource made after the request
            if(result.status === 201) {
                // Re-fetch users after successfully adding a new one
                const usersResponse = await fetch("http://localhost:3000/user/getAllUsers");
                const usersData = await usersResponse.json();

                if (usersData.success) {
                    setUsers(usersData.data);
                } else {
                    console.error("Error fetching users after adding a new one:", usersData.error);
                }
            }
        } catch (error) {
            alert("An error occurred: " + error);
        }
    };

    const columns = [
        {
            header: "First Name",
            accessorKey: "firstName",
        },
        {
            header: "Last Name",
            accessorKey: "lastName",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "User Type",
            accessorKey: "typeName",
        }
    ];

    return (
        <div className="main-div">
            <h2>Register a New User</h2>
            <br/>

            <form 
                className="form-grid" 
                onSubmit={collectData}
                style={{gridTemplateColumns: "6rem 12rem 6rem 12rem"}}
            >
                <label>First Name:</label>
                <input
                    type="text"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <label>Email:</label>
                <input
                    type="text"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Last Name:</label>
                <input
                    type="text"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <label>User Type:</label>
                <select
                    value={userType}
                    onChange={(e) => setUserType(Number(e.target.value))}
                    required
                >
                    <option value="0" disabled>
                        Select a user type
                    </option>
                    {userTypes.map((userType) => (
                        <option key={userType.id} value={userType.id}>
                            {userType.typeName}
                        </option>
                    ))}
                </select>
                <br />

                <button 
                    style={{ gridColumn: "4" }} 
                    type="submit"
                    disabled={userType === 0 || !firstName || !lastName || !email}>
                    Submit
                </button>
                
                <hr style={{ gridColumn: "1 / -1" }} />
            </form>

            <br />
            <DynamicTable data={users} columns={columns} tableTitle={"Users"}/>
        </div>
    );
};

export default RegisterUsers;