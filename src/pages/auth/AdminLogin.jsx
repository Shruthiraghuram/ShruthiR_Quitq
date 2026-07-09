import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginAdmin } from "../../services/AdminService";
import './Login.css';

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginAdmin(email, password);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "ADMIN");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Invalid admin credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-overlay"></div>
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="card login-card shadow-lg">
              <div className="card-body">
                <h2 className="text-center mb-3 welcome-text">Welcome to QuitQ</h2>
                <h5 className="text-center mb-4 text-secondary">Admin Login</h5>

                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Admin Login"}
                  </button>
                </form>

                <div className="text-center mt-4 border-top pt-3">
                  <p className="small mb-0">Not an admin?
                    <Link to="/login" className="ms-1">Customer Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;