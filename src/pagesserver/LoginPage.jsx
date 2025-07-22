import React, { useState } from "react";
import LoginForm from "../componentserver/LoginForm";
import axios from "axios";


const API_BASE = "http://localhost:8080/api/v1";

const LoginPage = () => {
  const [view, setView] = useState("login");
  const [message, setMessage] = useState("");

  const onLogin = async (userid, password) => {
    try {
      const res = await axios.post(`${API_BASE}/login`, {userid, password });
      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      const role = payload.role || "member";
      localStorage.setItem("role", role);

      window.location.href = role === "admin" ? "/admin" : "/profile";
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  const onRegister = async (userid, username, password) => {
    try {
      const res = await axios.post(`${API_BASE}/register`, { userid, username, password });
      setMessage(res.data.message || "Registered! Awaiting approval.");
      setView("login");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative text-green-600">

      <LoginForm view={view} setView={setView} onLogin={onLogin} onRegister={onRegister} message={message} />
    </div>
  );
};

export default LoginPage;
