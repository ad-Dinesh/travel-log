import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!fullName) return setError("Full name is required");
    if (!validateEmail(email)) return setError("Enter valid email");
    if (password.length < 6) return setError("Min 6 characters required");

    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.post(
        "/api/auth/create-account",
        { fullName, email, password }
      );

      // ✅ store token
      localStorage.setItem("token", data?.accessToken);
      localStorage.setItem("user", JSON.stringify(data?.user));

      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">

        {/* LEFT SAME AS LOGIN */}
        <div className="login-left">
          <div className="login-left-overlay" />

          <div className="login-left-content">
            <span className="login-left-tag">✦ Travel Log</span>
            <h2 className="login-left-title">
              Start Your Journey
            </h2>
            <p className="login-left-desc">
              Create your account and begin logging your travel stories.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="login-right">

          <h1 className="login-heading">Create Account</h1>
          <p className="login-subheading">Join and start exploring</p>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                className="login-input"
              />
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="login-input"
              />
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                className="login-input"
              />
            </div>

            {/* ERROR */}
            {error && <div className="login-error">{error}</div>}

            {/* BUTTON */}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "blue" }}>
              Sign In
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignUp;