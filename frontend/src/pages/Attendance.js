import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { addAttendance, deleteAttendance } from "../api";

function Attendance() {
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Present");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");



    const fetchEmployees = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/employees/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(res.data);
        } catch {
            setError("Failed to load employees");
        }
    }, [token]);

    const fetchAttendance = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/attendance/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAttendance(res.data);
        } catch {
            setError("Failed to load attendance records");
        }
    }, [token]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchEmployees(); fetchAttendance(); }, []);

    const markAttendance = async (e) => {
        e.preventDefault();
        try { await addAttendance(token, { employee_id: selectedEmployee, date, status }); setSelectedEmployee(""); setDate(""); setStatus("Present"); fetchAttendance(); } catch { setError("Failed to mark attendance"); }
    };

    const handleDelete = async (id) => { if (!window.confirm("Delete this attendance record?")) return; await deleteAttendance(token, id); fetchAttendance(); };

    return (
        <div className="container mt-5">
            <h2>Manage Attendance</h2>
            <form className="d-flex gap-2 mt-3" onSubmit={markAttendance}>
                <select className="form-control" value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} required>
                    <option value="">Select Employee</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                </select>
                <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
                <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </select>
                <button className="btn btn-primary">Mark</button>
            </form>
            {error && <p className="text-danger mt-2">{error}</p>}
            <h4 className="mt-4">Attendance Records</h4>
            <table className="table table-bordered mt-2">
                <thead className="table-dark"><tr><th>Employee</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                    {attendance.map(att => (
                        <tr key={att.id}>
                            <td>{att.employee_name}</td><td>{att.date}</td><td>{att.status}</td>
                            <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(att.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Attendance;
