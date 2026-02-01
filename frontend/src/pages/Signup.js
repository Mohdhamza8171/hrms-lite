import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // default empty
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!role) {
            setError("Please select a role");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/register/", {
                username,
                email,
                password,
                role,
            });
            navigate("/"); // redirect to login after successful signup
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                {/* Username */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="form-control mb-2"
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control mb-2"
                    autoComplete="off"
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control mb-2"
                    autoComplete="new-password"
                />

                {/* Role Dropdown */}
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-select mb-2"
                    required
                >
                    <option value="" disabled>
                        Select Role
                    </option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                </select>

                {error && <p className="text-danger">{error}</p>}

                <button className="btn btn-success">Sign Up</button>
            </form>

            <div className="mt-3">
                <Link to="/">Back to Login</Link>
            </div>
        </div>
    );
}

export default Signup;
