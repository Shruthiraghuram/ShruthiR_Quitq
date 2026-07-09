import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaBoxes, FaWarehouse, FaShoppingCart } from 'react-icons/fa';
import './SellerDashboard.css';

// SellerDashboard - responsive dashboard for sellers (placeholders only)
export default function SellerDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'add-product',
      icon: <FaPlus size={22} />,
      title: 'Add Product',
      description: 'Create a new product listing with images, price and details.',
      action: () => navigate('/seller/add-product'),
      actionLabel: 'Add',
    },
    {
      id: 'manage-products',
      icon: <FaBoxes size={22} />,
      title: 'Manage Products',
      description: 'Edit or remove existing product listings and view performance.',
      action: () => navigate('/seller/products'),
      actionLabel: 'Manage',
    },
    {
      id: 'inventory',
      icon: <FaWarehouse size={22} />,
      title: 'Inventory',
      description: 'Keep track of stock levels and restock alerts for your products.',
      action: () => navigate('/seller/inventory'),
      actionLabel: 'View',
    },
    {
      id: 'orders',
      icon: <FaShoppingCart size={22} />,
      title: 'Orders',
      description: 'View and manage incoming orders, shipments and returns.',
      action: () => navigate('/seller/orders'),
      actionLabel: 'View Orders',
    },
  ];

  return (
    <div className="seller-dashboard-container container-fluid">
      <nav className="navbar navbar-expand-lg navbar-light seller-dashboard-header mb-4">
        <div className="container-fluid px-3">
          <span className="navbar-brand mb-0 h4">Seller Dashboard</span>
          <div className="d-flex align-items-center">
            <div className="me-3 text-white opacity-75">Welcome back, Seller</div>
            <button
              className="btn btn-logout btn-sm"
              onClick={() => {
                // clear seller session and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('sellerId');
                localStorage.removeItem('role');
                navigate('/seller/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="row mb-4">
        <div className="col-12">
          <div className="seller-panel-card">
            <h5 className="mb-1">Good to see you!</h5>
            <p className="mb-0">Manage your store, add new items, and track orders from here.</p>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {cards.map((c) => (
          <div key={c.id} className="col-12 col-md-6 col-lg-3">
            <div className="seller-dashboard-card h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper me-3" aria-hidden>
                    {c.icon}
                  </div>
                  <div>
                    <h6 className="mb-0">{c.title}</h6>
                    <small>{c.description}</small>
                  </div>
                </div>

                <div className="mt-auto">
                  <button className="btn btn-primary w-100" onClick={c.action}>
                    {c.actionLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
