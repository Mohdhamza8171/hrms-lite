import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

function Signup() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!form.role) {
            return setError("Please select a role");
        }

        try {
            await registerUser(form);
            navigate("/"); // redirect to login page after successful signup
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup} autoComplete="off">
                <input
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    autoComplete="off"
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    autoComplete="off"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-control mb-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    autoComplete="new-password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="form-control mb-2"
                    required
                />
                <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="form-select mb-2"
                    required
                >
                    <option value="" disabled>Select Role</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                </select>
                {error && <p className="text-danger">{error}</p>}
                <button className="btn btn-success">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;
