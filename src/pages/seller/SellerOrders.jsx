import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getOrdersBySeller,
  updateOrderStatus,
} from '../../services/OrderService';

// Matches backend OrderStatus enum exactly
const ORDER_STATUSES = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_BADGE = {
  PLACED:     'bg-info text-dark',
  PROCESSING: 'bg-warning text-dark',
  SHIPPED:    'bg-primary',
  DELIVERED:  'bg-success',
  CANCELLED:  'bg-danger',
};

const PAYMENT_BADGE = {
  PENDING:   'bg-warning text-dark',
  COMPLETED: 'bg-success',
  FAILED:    'bg-danger',
};

export default function SellerOrders() {
  const navigate  = useNavigate();
  const sellerId  = localStorage.getItem('sellerId');

  const [orderItems, setOrderItems] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [searchId,   setSearchId]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating,   setUpdating]   = useState(null); // orderId being updated

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getOrdersBySeller(sellerId);
      setOrderItems(res.data || []);
    } catch (err) {
      console.error('Failed to load seller orders', err);
      setError('Unable to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sellerId) { navigate('/seller/login'); return; }
    loadOrders();
  }, [sellerId]);

  const formatDate = (val) => {
    if (!val) return '—';
    return new Date(val).toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh list so status reflects correctly from backend
      await loadOrders();
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Unable to update status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  // Each element from the API is an OrderItem — flatten the order details we need
  const filteredItems = orderItems.filter((item) => {
    const oid = String(item.order?.orderId ?? item.orderId ?? '');
    const matchId     = !searchId.trim() || oid.includes(searchId.trim());
    const itemStatus  = (item.order?.status ?? '').toUpperCase();
    const matchStatus = !statusFilter || itemStatus === statusFilter;
    return matchId && matchStatus;
  });

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="mb-1">Seller Orders</h4>
          <p className="text-muted mb-0">View and manage orders containing your products.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/seller/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Search by Order ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 42"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Filter by Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => { setSearchId(''); setStatusFilter(''); }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading orders…</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="alert alert-info">No orders found for the selected filters.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-responsive d-none d-lg-block">
            <table className="table table-hover table-striped align-middle border">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th className="text-center">Qty</th>
                  <th>Order Date</th>
                  <th>Total (₹)</th>
                  <th>Payment</th>
                  <th>Pay Status</th>
                  <th>Order Status</th>
                  <th className="text-center">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const order     = item.order ?? {};
                  const orderId   = order.orderId ?? item.orderId;
                  const customer  = order.user?.name ?? '—';
                  const product   = item.product?.productName ?? item.productName ?? '—';
                  const qty       = item.quantity ?? '—';
                  const date      = order.orderDate;
                  const total     = order.totalAmount ?? 0;
                  const payMethod = order.paymentMethod ?? '—';
                  const payStat   = (order.paymentStatus ?? '').toUpperCase();
                  const status    = (order.status ?? '').toUpperCase();

                  return (
                    <tr key={item.orderItemId ?? `${orderId}-${item.product?.productId}`}>
                      <td className="fw-bold">#{orderId}</td>
                      <td>{customer}</td>
                      <td>{product}</td>
                      <td className="text-center">{qty}</td>
                      <td className="text-nowrap">{formatDate(date)}</td>
                      <td>₹{Number(total).toLocaleString('en-IN')}</td>
                      <td>{payMethod}</td>
                      <td>
                        <span className={`badge ${PAYMENT_BADGE[payStat] ?? 'bg-secondary'}`}>
                          {payStat || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[status] ?? 'bg-secondary'}`}>
                          {status || '—'}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={updating === orderId}
                          >
                            {updating === orderId ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : 'Change'}
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            {ORDER_STATUSES.map((s) => (
                              <li key={s}>
                                <button
                                  className={`dropdown-item ${status === s ? 'active' : ''}`}
                                  type="button"
                                  onClick={() => handleStatusChange(orderId, s)}
                                >
                                  {s.charAt(0) + s.slice(1).toLowerCase()}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="row d-lg-none g-3">
            {filteredItems.map((item) => {
              const order     = item.order ?? {};
              const orderId   = order.orderId ?? item.orderId;
              const customer  = order.user?.name ?? '—';
              const product   = item.product?.productName ?? item.productName ?? '—';
              const qty       = item.quantity ?? '—';
              const date      = order.orderDate;
              const total     = order.totalAmount ?? 0;
              const payMethod = order.paymentMethod ?? '—';
              const payStat   = (order.paymentStatus ?? '').toUpperCase();
              const status    = (order.status ?? '').toUpperCase();

              return (
                <div key={item.orderItemId ?? `${orderId}-${item.product?.productId}`} className="col-12">
                  <div className="card shadow-sm border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <div>
                          <h6 className="mb-0 fw-bold">Order #{orderId}</h6>
                          <small className="text-muted">{customer}</small>
                        </div>
                        <span className={`badge ${STATUS_BADGE[status] ?? 'bg-secondary'}`}>{status || '—'}</span>
                      </div>
                      <div className="row g-1 small mb-3">
                        <div className="col-6"><span className="text-muted">Product: </span>{product}</div>
                        <div className="col-6"><span className="text-muted">Qty: </span>{qty}</div>
                        <div className="col-6"><span className="text-muted">Total: </span>₹{Number(total).toLocaleString('en-IN')}</div>
                        <div className="col-6"><span className="text-muted">Payment: </span>{payMethod}</div>
                        <div className="col-6">
                          <span className="text-muted">Pay Status: </span>
                          <span className={`badge ${PAYMENT_BADGE[payStat] ?? 'bg-secondary'}`}>{payStat || '—'}</span>
                        </div>
                        <div className="col-12"><span className="text-muted">Date: </span>{formatDate(date)}</div>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {ORDER_STATUSES.map((s) => (
                          <button
                            key={s}
                            className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => handleStatusChange(orderId, s)}
                            disabled={updating === orderId || status === s}
                          >
                            {updating === orderId && status !== s
                              ? <span className="spinner-border spinner-border-sm" />
                              : s.charAt(0) + s.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
