import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { deleteEmployee } from "../api";
import axios from "axios";


function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchEmployees = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(res.data);
        } catch {
            setError("Failed to fetch employees");
        }
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this employee?")) return;
        await deleteEmployee(token, id);
        fetchEmployees();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!token) {
            navigate("/");
        } else {
            fetchEmployees();
        }
    }, [token, navigate, fetchEmployees]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard</h2>
                <button className="btn btn-primary" onClick={() => navigate("/add-employee")}>Add Employee</button>
                <button className="btn btn-secondary" onClick={() => navigate("/attendance")}>Manage Attendance</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <table className="table table-striped">
                <thead className="table-dark"><tr><th>ID</th><th>Full Name</th><th>Email</th><th>Department</th><th>Action</th></tr></thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.employee_id}</td>
                            <td>{emp.full_name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.department}</td>
                            <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
