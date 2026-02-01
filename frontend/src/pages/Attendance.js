import { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("present");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchEmployees();
        fetchAttendance();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/employees/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(res.data);
        } catch {
            setError("Failed to load employees");
        }
    };

    const fetchAttendance = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/attendance/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAttendance(res.data);
        } catch {
            setError("Failed to load attendance records");
        }
    };

    const markAttendance = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/attendance/add/",
                { employee_id: selectedEmployee, date, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedEmployee("");
            setDate("");
            setStatus("present");
            fetchAttendance();
        } catch {
            setError("Failed to mark attendance");
        }
    };

    const deleteAttendance = async (id) => {
        if (!window.confirm("Delete this attendance record?")) return;

        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/attendance/${id}/delete/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchAttendance();
        } catch (err) {
            console.error("Delete error:", err.response?.data);
            setError(err.response?.data?.error || "Failed to delete attendance");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Manage Attendance</h2>
            <form className="d-flex gap-2 mt-3" onSubmit={markAttendance}>
                <select
                    className="form-control"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.full_name}
                        </option>
                    ))}
                </select>

                <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />

                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>

                <button className="btn btn-primary">Mark</button>
            </form>

            {error && <p className="text-danger mt-2">{error}</p>}

            <h4 className="mt-4">Attendance Records</h4>
            {attendance.length === 0 ? (
                <p>No records found.</p>
            ) : (
                <table className="table table-bordered mt-2">
                    <thead className="table-dark">
                        <tr>
                            <th>Employee</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((att) => (
                            <tr key={att.id}>
                                <td>{att.employee_name}</td>
                                <td>{att.date}</td>
                                <td>{att.status}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteAttendance(att.id)}
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

export default Attendance;
