import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddEmployee() {
    const [employee, setEmployee] = useState({ employee_id: "", full_name: "", email: "", department: "" });
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:8000/api/employees/add/", employee, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add employee");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Employee</h2>
            <form onSubmit={handleAdd} className="mt-3">
                <input
                    type="text"
                    placeholder="Employee ID"
                    value={employee.employee_id}
                    onChange={(e) => setEmployee({ ...employee, employee_id: e.target.value })}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Full Name"
                    value={employee.full_name}
                    onChange={(e) => setEmployee({ ...employee, full_name: e.target.value })}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={employee.email}
                    onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={employee.department}
                    onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
                    className="form-control mb-2"
                    required
                />
                {error && <p className="text-danger">{error}</p>}
                <button className="btn btn-success">Add Employee</button>
            </form>
        </div>
    );
}

export default AddEmployee;
