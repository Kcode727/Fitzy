import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './register.css';

const SignIn = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(`${apiUrl}/api/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Sign in failed.");
        setIsError(true);
        return;
      }

      if (data.success) {
        setMessage("Sign in successful! Redirecting...");
        setIsError(false);

        setTimeout(() => {
          navigate("/mySpace", { state: { username: formData.username } });
        }, 1500);

        setFormData({
          username: "",
          password: ""
        });
      } else {
        setMessage(data.message || "Sign in failed.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage("Unable to connect to the server.");
      setIsError(true);
    }
  };

  return (
    <div className="center-wrapper">
      <div className="auth-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-row">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit">Sign In</button>
        </form>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="auth-link">
          Don't have an account? <span className="link" onClick={() => navigate('/register')}>Register here</span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
