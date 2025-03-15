import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./AddEmpPopUp.css";

const AddEmpPopUp = ({ onClose }) => {
    const hotelID = localStorage.getItem("hotelID"); // Static Hotel ID
    const [departments, setDepartments] = useState([]);
    const [employee, setEmployee] = useState({
        deptID: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        hourlyPay: "",
        salary: "",
        workingStatus: "Working",
        role: "manager",
        hiredDate: "",
        address: { city: "", state: "" }
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Fetch Available Departments
    const fetchDepartments = () => {
        


        Axios.post("http://localhost:3001/all-hotels")
            .then((response) => {
                setDepartments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching departments:", error);
                alert("Failed to fetch departments.");
            });
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({
            ...prev,
            [name]: value
        }));


    };

    // Handle Address Change
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    // Submit Employee Data
    const addEmployee = () => {
        Axios.post("http://localhost:3001/find-departments", { hotelID: employee.deptID })
            .then((response) => {
                console.log("Response from BE:", response.data[0].DeptID);
    
                // Update the state and ensure it's updated before sending the request
                setEmployee((prev) => {
                    const updatedEmployee = { ...prev, deptID: response.data[0].DeptID };
                    console.log("Updated Employee:", updatedEmployee); // Check if it updates
                    sendEmployeeData(updatedEmployee); // Call function to send data
                    return updatedEmployee;
                });
            })
            .catch((error) => {
                console.error("Error fetching departments:", error);
                alert("Failed to fetch departments.");
            });
    };
    
    // Separate function to send employee data after state update
    const sendEmployeeData = (updatedEmployee) => {
        Axios.post("http://localhost:3001/add-employee", updatedEmployee)
            .then(() => {
                alert("Employee added successfully!");
                onClose(); // Close the popup
            })
            .catch((error) => {
                console.error("Error adding employee:", error);
                alert("Failed to add employee.");
            });
    };
    

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2>Add Employee</h2>

                <label>Hotels:</label>
                <select name="deptID" value={employee.deptID} onChange={handleChange}>
                    <option value="">Select Hotels</option>
                    {departments.map((dept) => (
                        <option key={dept.HotelID} value={dept.HotelID}>
                            {dept.Name}
                        </option>
                    ))}
                </select>

                <label>First Name:</label>
                <input type="text" name="firstName" value={employee.firstName} onChange={handleChange} />

                <label>Last Name:</label>
                <input type="text" name="lastName" value={employee.lastName} onChange={handleChange} />

                <label>Phone:</label>
                <input type="text" name="phone" value={employee.phone} onChange={handleChange} />

                <label>Email:</label>
                <input type="email" name="email" value={employee.email} onChange={handleChange} />

                <label>Hourly Pay:</label>
                <input type="number" name="hourlyPay" value={employee.hourlyPay} onChange={handleChange} />

                {/* <label>Salary:</label>
                <input type="number" name="salary" value={employee.salary} onChange={handleChange} /> */}

                <label>Working Status:</label>
                <select name="workingStatus" value={employee.workingStatus} onChange={handleChange}>
                    <option value="Working">Working</option>
                    <option value="Not Working">Not Working</option>
                </select>



                <label>Hired Date:</label>
                <input type="date" name="hiredDate" value={employee.hiredDate} onChange={handleChange} />

                <label>City:</label>
                <input type="text" name="city" value={employee.address.city} onChange={handleAddressChange} />

                <label>State:</label>
                <input type="text" name="state" value={employee.address.state} onChange={handleAddressChange} />

                <div className="popup-actions">
                    <button onClick={addEmployee}>Add Employee</button>
                    <button className="close-popup-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEmpPopUp;
