import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    const payload = {
      ...formData,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
    };

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || `Registration failed with status ${response.status}`);
        setIsError(true);
        return;
      }

      if (data.success) {
        setMessage("Registration successful! Redirecting to dashboard...");
        setIsError(false);
        setTimeout(() => {
          navigate("/mySpace");
        }, 1500);
        setFormData({
          email: "",
          username: "",
          password: "",
          age: "",
          gender: "",
          height: "",
          weight: "",
        });
      } else {
        setMessage(data.message || "Registration failed");
        setIsError(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Cannot connect to server. Make sure the backend is running on port 5000.");
      setIsError(true);
    }
  };

  return (
    <div className="center-wrapper">
      <div className="auth-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-row">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field-row">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="field-row">
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required min="1" />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="field-row">
            <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} required min="100" />
            <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} required min="20" />
          </div>

          <button type="submit">Register</button>
        </form>

        {message && (
          <div className={`message ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <div className="auth-link">
          Already have an account? <span className="link" onClick={() => navigate('/signin')}>Sign in here</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
