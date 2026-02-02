import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = (email, password) =>
    axios.post(`${API_URL}/api/login/`, { email, password });

export const registerUser = (data) =>
    axios.post(`${API_URL}/api/register/`, data);

export const addEmployee = (token, data) =>
    axios.post(`${API_URL}/api/employees/add/`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const listEmployees = (token) =>
    axios.get(`${API_URL}/api/employees/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteEmployee = (token, empId) =>
    axios.delete(`${API_URL}/api/employees/${empId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const listAttendance = (token) =>
    axios.get(`${API_URL}/api/attendance/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const addAttendance = (token, data) =>
    axios.post(`${API_URL}/api/attendance/add/`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteAttendance = (token, attId) =>
    axios.delete(`${API_URL}/api/attendance/${attId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
    });

