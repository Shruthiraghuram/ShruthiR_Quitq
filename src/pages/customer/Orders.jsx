import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdersByUser, getOrderItems, cancelOrder } from '../../services/OrderService';
import { getUserId, isLoggedIn, logout } from '../../utils/AuthUtils';

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = getUserId();

  useEffect(() => {
    if (!isLoggedIn() || !userId) {
      logout();
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [navigate, userId]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getOrdersByUser(userId);
      const data = response.data;
      const ordersList = Array.isArray(data) ? data : data?.orders || [];
      setOrders(ordersList);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setError('Unable to load your orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setOrderItems([]);
    setDetailsLoading(true);

    try {
      const response = await getOrderItems(order.orderId || order.id);
      setOrderItems(Array.isArray(response.data) ? response.data : response.data?.items || []);
    } catch (err) {
      console.error('Failed to load order items', err);
      setError('Unable to load order details. Please try again.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCancelOrder = async (order) => {
    if (!window.confirm('Cancel this order?')) {
      return;
    }

    try {
      await cancelOrder(order.orderId || order.id);
      await fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error('Cancel order failed', err);
      setError('Unable to cancel the order. Please try again.');
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProductImage = (item) => {
    return item.product?.imageUrl || item.product?.image_url || item.imageUrl || item.image_url || item.product?.images?.[0] || 'https://via.placeholder.com/120x120?text=No+Image';
  };

  const renderStatusBadge = (status) => {
    const normalized = (status || '').toString().toLowerCase();
    const map = {
      pending: 'secondary',
      confirmed: 'info',
      processing: 'warning',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
    };
    return `badge bg-${map[normalized] || 'secondary'}`;
  };

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="mb-1">My Orders</h4>
          <p className="text-muted mb-0">Review your past purchases and track order status.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/home')}>
          Continue Shopping
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading orders...</p>
        </div>
      ) : (
        <>
          {error && <div className="alert alert-danger">{error}</div>}

          {orders.length === 0 ? (
            <div className="alert alert-info">You have no orders yet.</div>
          ) : (
            <div className="row g-4">
              <div className="col-12 col-xl-8">
                {orders.map((order) => {
                  const orderId = order.orderId || order.id || order.order?.id;
                  const items = order.items || order.orderItems || [];
                  const total = Number(order.totalAmount || order.amount || 0);
                  return (
                    <div key={orderId} className="card mb-3 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                          <div>
                            <h6 className="mb-1">Order #{orderId}</h6>
                            <p className="text-muted small mb-1">Placed on {formatDate(order.orderDate || order.createdAt)}</p>
                            <span className={renderStatusBadge(order.orderStatus || order.status)}>
                              {order.orderStatus || order.status || 'Unknown'}
                            </span>
                          </div>
                          <div className="text-end">
                            <strong>₹{total.toLocaleString()}</strong>
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-2">
                          {items.slice(0, 3).map((item) => (
                            <div key={item.orderItemId || item.itemId || item.id} className="d-flex gap-3 align-items-center border rounded p-2">
                              <div className="flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                                <img
                                  src={getProductImage(item)}
                                  alt={item.productName || item.product?.name || 'Product'}
                                  className="img-fluid rounded"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <div className="fw-bold">{item.productName || item.product?.name || 'Product'}</div>
                                <div className="small text-muted">
                                  Qty: {item.quantity ?? item.qty ?? 1} · ₹{Number(item.price ?? item.unitPrice ?? 0).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 d-flex flex-wrap gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => viewOrderDetails(order)}>
                            View Details
                          </button>
                          {(order.orderStatus || order.status || '').toString().toLowerCase() !== 'delivered' && (
                            <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleCancelOrder(order)}>
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-12 col-xl-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Order Details</h5>
                    {selectedOrder ? (
                      <>
                        <div className="mb-3">
                          <div className="small text-muted">Order ID</div>
                          <div>{selectedOrder.orderId || selectedOrder.id}</div>
                        </div>
                        <div className="mb-3">
                          <div className="small text-muted">Order date</div>
                          <div>{formatDate(selectedOrder.orderDate || selectedOrder.createdAt)}</div>
                        </div>
                        <div className="mb-3">
                          <div className="small text-muted">Payment method</div>
                          <div>{selectedOrder.paymentMethod || 'N/A'}</div>
                        </div>
                        <div className="mb-3">
                          <div className="small text-muted">Payment status</div>
                          <div>{selectedOrder.paymentStatus || 'N/A'}</div>
                        </div>
                        <div className="mb-3">
  <div className="small text-muted">Shipping Address</div>

  {selectedOrder.shippingAddress ? (
    <>
      <div>{selectedOrder.shippingAddress.street}</div>
      <div>
        {selectedOrder.shippingAddress.city},{" "}
        {selectedOrder.shippingAddress.state}
      </div>
      <div>
        {selectedOrder.shippingAddress.zipCode},{" "}
        {selectedOrder.shippingAddress.country}
      </div>
    </>
  ) : (
    <div>Not available</div>
  )}
</div>
                        <div className="mb-3">
                          <div className="small text-muted">Order total</div>
                          <div>₹{Number(selectedOrder.totalAmount || selectedOrder.amount || 0).toLocaleString()}</div>
                        </div>
                        <div className="mb-3">
                          <div className="small text-muted">Status</div>
                          <div>{selectedOrder.orderStatus || selectedOrder.status || 'Unknown'}</div>
                        </div>
                        <div className="mb-3">
                          <div className="small text-muted mb-2">Ordered items</div>
                          {orderItems.length > 0 ? (
                            <div className="list-group list-group-flush">
                              {orderItems.map((item) => {
                                const productName = item.productName || item.product?.name || 'Product';
                                const quantity = item.quantity ?? item.qty ?? 1;
                                const price = Number(
    item.priceAtPurchase ??
    item.price ??
    item.unitPrice ??
    0
);
                                return (
                                  <div key={item.orderItemId || item.itemId || item.id} className="list-group-item px-0 border-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <div className="fw-semibold">{productName}</div>
                                        <div className="small text-muted">Qty {quantity}</div>
                                      </div>
                                      <div className="text-end">
                                        ₹{(price * quantity).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="small text-muted mb-0">No item details available.</p>
                          )}
                        </div>
                        <div className="d-grid gap-2">
                          <button className="btn btn-outline-secondary" type="button" onClick={() => setSelectedOrder(null)}>
                            Close Details
                          </button>
                          {selectedOrder && (selectedOrder.orderStatus || selectedOrder.status || '').toString().toLowerCase() !== 'delivered' && (
                            <button className="btn btn-outline-danger" type="button" onClick={() => handleCancelOrder(selectedOrder)}>
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-muted">Select an order to view its details.</p>
                    )}
                    {detailsLoading && (
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Orders;
