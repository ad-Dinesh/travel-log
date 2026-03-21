import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();

    if (!validateEmail(trimmedEmail)) {
      return setError("Enter a valid email address");
    }

    if (!trimmedPassword) {
      return setError("Password is required");
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await axiosInstance.post("/api/auth/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // ✅ Store token + user
      localStorage.setItem("token", data?.accessToken);
      localStorage.setItem("user", JSON.stringify(data?.user));

      // ✅ Redirect
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">

        {/* LEFT */}
        <div className="login-left">
          <div className="login-left-overlay" />

          <div className="login-left-content">
            <span className="login-left-tag">✦ Travel Log</span>
            <h2 className="login-left-title">
              Every Journey<br />Deserves a Story
            </h2>
            <p className="login-left-desc">
              Track, save and relive your best travel memories.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">

          <h1 className="login-heading">Welcome back</h1>
          <p className="login-subheading">Sign in to continue</p>

          <form onSubmit={handleSubmit} noValidate>

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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="login-input"
              />
            </div>

            {/* ERROR */}
            {error && <div className="login-error">{error}</div>}

            {/* BUTTON */}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p>
            New user?{" "}
            <span onClick={() => navigate("/signUp")} style={{ cursor: "pointer", color: "blue" }}>
              Create account
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;