import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserTie,
  FaShoppingBag,
  FaShoppingCart,
  FaTrash,
  FaSearch,
  FaSignOutAlt,
  FaSync,
} from "react-icons/fa";
import {
  getDashboard,
  getUsers,
  getSellers,
  getProducts,
  getOrders,
  deleteUser,
  deleteSeller,
} from "../../services/AdminService";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    customersCount: 0,
    sellersCount: 0,
    productsCount: 0,
    ordersCount: 0,
  });

  // Table lists
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Search queries
  const [searchQueries, setSearchQueries] = useState({
    users: "",
    sellers: "",
    products: "",
    orders: "",
  });

  const checkAdminAuth = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      navigate("/admin/login");
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    if (!checkAdminAuth()) return;
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, sellersRes, productsRes, ordersRes] =
        await Promise.all([
          getDashboard(),
          getUsers(),
          getSellers(),
          getProducts(),
          getOrders(),
        ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSellers(sellersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        alert("User deleted successfully!");
        fetchData(); // Reload all data
      } catch (err) {
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      try {
        await deleteSeller(sellerId);
        alert("Seller deleted successfully!");
        fetchData(); // Reload all data
      } catch (err) {
        alert("Failed to delete seller. Please try again.");
      }
    }
  };

  // Filtering data based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQueries.users.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQueries.users.toLowerCase())
  );

  const filteredSellers = sellers.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQueries.sellers.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQueries.sellers.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.productName?.toLowerCase().includes(searchQueries.products.toLowerCase()) ||
      p.sellerName?.toLowerCase().includes(searchQueries.products.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.user?.name?.toLowerCase().includes(searchQueries.orders.toLowerCase()) ||
      o.orderId?.toString().includes(searchQueries.orders) ||
      o.status?.toLowerCase().includes(searchQueries.orders.toLowerCase())
  );

  return (
    <div className="container-fluid min-vh-100 bg-light py-4">
      {/* Header Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 bg-dark text-white p-3 rounded shadow">
        <h2 className="mb-0 fw-bold d-flex align-items-center">
          <FaUserTie className="me-2 text-warning" /> QuitQ Admin Panel
        </h2>
        <div className="d-flex align-items-center">
          <button
            onClick={fetchData}
            className="btn btn-outline-light me-2 btn-sm d-flex align-items-center"
            disabled={loading}
          >
            <FaSync className={`me-1 ${loading ? "fa-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm d-flex align-items-center"
          >
            <FaSignOutAlt className="me-1" /> Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger shadow-sm mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {/* Customers Count */}
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card border-0 shadow-sm rounded-3 bg-white h-100"
            style={{ borderLeft: "5px solid #0056b3" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-uppercase text-muted fw-bold mb-1 small">
                  Customers
                </h6>
                <h3 className="mb-0 fw-bold text-dark">
                  {stats.customersCount}
                </h3>
              </div>
              <div
                className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "rgba(0, 86, 179, 0.1)", width: "55px", height: "55px" }}
              >
                <FaUsers size={24} style={{ color: "#0056b3" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sellers Count */}
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card border-0 shadow-sm rounded-3 bg-white h-100"
            style={{ borderLeft: "5px solid #6f42c1" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-uppercase text-muted fw-bold mb-1 small">
                  Sellers
                </h6>
                <h3 className="mb-0 fw-bold text-dark">{stats.sellersCount}</h3>
              </div>
              <div
                className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "rgba(111, 66, 193, 0.1)", width: "55px", height: "55px" }}
              >
                <FaUserTie size={24} style={{ color: "#6f42c1" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card border-0 shadow-sm rounded-3 bg-white h-100"
            style={{ borderLeft: "5px solid #198754" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-uppercase text-muted fw-bold mb-1 small">
                  Products
                </h6>
                <h3 className="mb-0 fw-bold text-dark">
                  {stats.productsCount}
                </h3>
              </div>
              <div
                className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "rgba(25, 135, 84, 0.1)", width: "55px", height: "55px" }}
              >
                <FaShoppingBag size={24} style={{ color: "#198754" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Count */}
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card border-0 shadow-sm rounded-3 bg-white h-100"
            style={{ borderLeft: "5px solid #fd7e14" }}
          >
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-uppercase text-muted fw-bold mb-1 small">
                  Orders
                </h6>
                <h3 className="mb-0 fw-bold text-dark">{stats.ordersCount}</h3>
              </div>
              <div
                className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "rgba(253, 126, 20, 0.1)", width: "55px", height: "55px" }}
              >
                <FaShoppingCart size={24} style={{ color: "#fd7e14" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Card */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
        <div className="card-header bg-white border-0 py-3">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link fw-bold ${activeTab === "users" ? "active text-primary" : "text-muted"}`}
                onClick={() => setActiveTab("users")}
              >
                Customers ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-bold ${activeTab === "sellers" ? "active text-primary" : "text-muted"}`}
                onClick={() => setActiveTab("sellers")}
              >
                Sellers ({sellers.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-bold ${activeTab === "products" ? "active text-primary" : "text-muted"}`}
                onClick={() => setActiveTab("products")}
              >
                Products ({products.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-bold ${activeTab === "orders" ? "active text-primary" : "text-muted"}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders ({orders.length})
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading dashboard records...</p>
            </div>
          ) : (
            <>
              {/* Tab: Customers */}
              {activeTab === "users" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0 text-dark">Customer Accounts</h5>
                    <div className="input-group" style={{ maxWidth: "350px" }}>
                      <span className="input-group-text bg-white border-end-0">
                        <FaSearch className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search customers..."
                        value={searchQueries.users}
                        onChange={(e) =>
                          setSearchQueries({ ...searchQueries, users: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle border">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Gender</th>
                          <th>Contact</th>
                          <th>Address</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted py-4">
                              No customers found matching the criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user.userId}>
                              <td className="fw-bold">{user.userId}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {user.gender || "N/A"}
                                </span>
                              </td>
                              <td>{user.contactNumber || "N/A"}</td>
                              <td className="text-truncate" style={{ maxWidth: "200px" }}>
                                {user.address || "N/A"}
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleDeleteUser(user.userId)}
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete User"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Sellers */}
              {activeTab === "sellers" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0 text-dark">Seller Accounts</h5>
                    <div className="input-group" style={{ maxWidth: "350px" }}>
                      <span className="input-group-text bg-white border-end-0">
                        <FaSearch className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search sellers..."
                        value={searchQueries.sellers}
                        onChange={(e) =>
                          setSearchQueries({ ...searchQueries, sellers: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle border">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Address</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSellers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center text-muted py-4">
                              No sellers found matching the criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredSellers.map((seller) => (
                            <tr key={seller.sellerId}>
                              <td className="fw-bold">{seller.sellerId}</td>
                              <td>{seller.name}</td>
                              <td>{seller.email}</td>
                              <td>{seller.contactNumber || "N/A"}</td>
                              <td className="text-truncate" style={{ maxWidth: "250px" }}>
                                {seller.address || "N/A"}
                              </td>
                              <td className="text-center">
                                <button
                                  onClick={() => handleDeleteSeller(seller.sellerId)}
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete Seller"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Products */}
              {activeTab === "products" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0 text-dark">Product Catalog</h5>
                    <div className="input-group" style={{ maxWidth: "350px" }}>
                      <span className="input-group-text bg-white border-end-0">
                        <FaSearch className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search products..."
                        value={searchQueries.products}
                        onChange={(e) =>
                          setSearchQueries({ ...searchQueries, products: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle border">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Product Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Seller</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted py-4">
                              No products found matching the criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((product) => (
                            <tr key={product.productId}>
                              <td className="fw-bold">{product.productId}</td>
                              <td>{product.productName}</td>
                              <td>
                                <span className="badge bg-light text-dark border">
                                  {product.categoryName}
                                </span>
                              </td>
                              <td className="fw-bold">${product.price?.toFixed(2)}</td>
                              <td>{product.stockNumber}</td>
                              <td>{product.sellerName}</td>
                              <td>
                                {product.available ? (
                                  <span className="badge bg-success">Available</span>
                                ) : (
                                  <span className="badge bg-danger">Out of Stock</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Orders */}
              {activeTab === "orders" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0 text-dark">Customer Orders</h5>
                    <div className="input-group" style={{ maxWidth: "350px" }}>
                      <span className="input-group-text bg-white border-end-0">
                        <FaSearch className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search orders..."
                        value={searchQueries.orders}
                        onChange={(e) =>
                          setSearchQueries({ ...searchQueries, orders: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover table-striped align-middle border">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Customer</th>
                          <th>Total Amount</th>
                          <th>Payment Method</th>
                          <th>Payment Status</th>
                          <th>Order Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center text-muted py-4">
                              No orders found matching the criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.orderId}>
                              <td className="fw-bold">#{order.orderId}</td>
                              <td>{order.user?.name || "N/A"}</td>
                              <td className="fw-bold">${order.totalAmount?.toFixed(2)}</td>
                              <td>{order.paymentMethod}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    order.paymentStatus === "COMPLETED"
                                      ? "bg-success"
                                      : "bg-warning text-dark"
                                  }`}
                                >
                                  {order.paymentStatus}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    order.status === "DELIVERED"
                                      ? "bg-success"
                                      : order.status === "CANCELLED"
                                      ? "bg-danger"
                                      : "bg-info text-dark"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
