import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerSeller } from '../../services/SellerService';

function SellerRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        contactNumber: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerSeller(formData);
            alert('Seller registration successful! Please login.');
            navigate('/seller/login');
        } catch (err) {
            setError('Registration failed! Email may already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">QuitQ</h2>
                            <h5 className="text-center mb-4">Seller Registration</h5>
                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label">Store Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Enter store name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="contactNumber"
                                        placeholder="Enter contact number"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        placeholder="Enter address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-warning w-100"
                                    disabled={loading}>
                                    {loading ? 'Registering...' : 'Register as Seller'}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p>Already have an account?
                                    <Link to="/seller/login"> Login here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerRegister;