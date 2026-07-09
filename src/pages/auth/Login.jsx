import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/UserService';
import { saveToken, saveRole, saveUserId } from '../../utils/AuthUtils';
import './Login.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await loginUser(email, password);
    console.log("Login Response:", response.data);
            saveToken(response.data.token);
            saveRole(response.data.role);
            const userId = response.data.userId || response.data.id || response.data.user?.id;
            if (userId) {
                saveUserId(userId);
            }

            if (response.data.role === 'CUSTOMER') {
                navigate('/home');
            } else if (response.data.role === 'SELLER') {
                navigate('/seller/dashboard');
            } else if (response.data.role === 'ADMIN') {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password!');
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
                                <h5 className="text-center mb-4 text-secondary">Login</h5>
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
                                        disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </form>
                                <div className="text-center mt-4 border-top pt-3">
                                    <p className="small mb-2">Don't have an account? 
                                        <Link to="/register" className="ms-1">Register here</Link>
                                    </p>
                                    <p className="small mb-2">Are you a seller? 
                                        <Link to="/seller/login" className="ms-1">Seller Login</Link>
                                    </p>
                                    <p className="mb-0 mt-3">
                                        <button
                                            className="btn btn-outline-dark btn-sm w-100 fw-bold"
                                            onClick={() => navigate("/admin/login")}
                                        >
                                            Admin Login
                                        </button>
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

export default Login;