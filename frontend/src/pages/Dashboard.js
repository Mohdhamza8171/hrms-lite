import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    useEffect(() => {
        if (!token) navigate("/");
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/employees/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(res.data);
        } catch (err) {
            setError("Failed to fetch employees");
        }
    };

    const deleteEmployee = async (id) => {
        if (!window.confirm("Delete this employee?")) return;

        try {
            console.log("Deleting employee with id:", id);
            await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/delete/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            fetchEmployees(); // refresh table
        } catch (err) {
            alert("Delete failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome, {username}</h2>
                <button className="btn btn-danger" onClick={logout}>
                    Logout
                </button>
            </div>

            <div className="mb-3 d-flex gap-2">
                <button className="btn btn-primary" onClick={() => navigate("/add-employee")}>
                    Add Employee
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/attendance")}>
                    Manage Attendance
                </button>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <h4>All Employees</h4>
            {employees.length === 0 ? (
                <p>No employees found.</p>
            ) : (
                <table className="table table-striped table-bordered mt-2">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp._id}>
                                <td>{emp.id}</td>
                                <td>{emp.full_name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.department}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteEmployee(emp.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;
