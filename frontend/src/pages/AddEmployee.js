import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEmployee } from "../api";

function AddEmployee() {
    const [employee, setEmployee] = useState({ employee_id: "", full_name: "", email: "", department: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await addEmployee(token, employee);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add employee");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Employee</h2>
            <form onSubmit={handleAdd}>
                {["employee_id", "full_name", "email", "department"].map((key) => (
                    <input key={key} type={key === "email" ? "email" : "text"} placeholder={key.replace("_", " ")} value={employee[key]} onChange={(e) => setEmployee({ ...employee, [key]: e.target.value })} className="form-control mb-2" required />
                ))}
                {error && <p className="text-danger">{error}</p>}
                <button className="btn btn-success">Add Employee</button>
            </form>
        </div>
    );
}

export default AddEmployee;
