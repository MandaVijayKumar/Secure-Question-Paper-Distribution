import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password
      });

      localStorage.setItem("accessToken", res.data.token);

      if (res.data.role === "controller") {
        navigate("/controller/dashboard");
      } else {
        navigate("/principal/dashboard");
      }

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo-section">
          <h1>Secure Exam Portal</h1>
          <p>Controller of Examinations</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter official email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="footer-text">
          © 2026 Rayalaseema University Examination System
        </div>

      </div>
    </div>
  );
};

export default Login;