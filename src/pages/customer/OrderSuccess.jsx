import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/home');
    }
  }, [navigate, order]);

  if (!order) {
    return null;
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '720px' }}>
        <div className="card-body text-center py-5">
            <div className="display-1 text-success mb-3">
    ✅
</div>
          <div className="mb-4">
            <span className="badge bg-success fs-6">Order Placed</span>
          </div>
          <h3 className="fw-bold mb-3">Thank you for your purchase!</h3>
          <p className="text-muted mb-4">
            Your order has been placed successfully. below are the order details.
          </p>
          <div className="row text-start gx-4 gy-3 mb-4">
            <div className="col-12 col-md-6">
              <div className="fw-semibold">Order ID</div>
              <div>{order.orderId || order.id || order.order?.id}</div>
            </div>
            <div className="col-12 col-md-6">
              <div className="fw-semibold">Payment method</div>
              <div>{order.paymentMethod || 'N/A'}</div>
            </div>
            <div className="col-12 col-md-6">
    <div className="fw-semibold">Order Status</div>
    <span className="badge bg-success">
        {order.status || order.orderStatus || "Placed"}
    </span>
</div>
<div className="col-12 col-md-6">
    <div className="fw-semibold">Payment Status</div>
    <span className="badge bg-primary">
        {order.paymentStatus || "Pending"}
    </span>
</div>
            <div className="col-12 col-md-6">
  <div className="fw-semibold">Shipping Address</div>

  {order.shippingAddress ? (
    <>
      <div>{order.shippingAddress.street}</div>
      <div>
        {order.shippingAddress.city}, {order.shippingAddress.state}
      </div>
      <div>
        {order.shippingAddress.zipCode}, {order.shippingAddress.country}
      </div>
      <div className="col-12 col-md-6">
    <div className="fw-semibold">Estimated Delivery</div>
    <div className="text-success">
        3-5 Business Days
    </div>
</div>
    </>
  ) : (
    <div>{order.addressLine || 'Not provided'}</div>
  )}
</div>
            <div className="col-12 col-md-6">
              <div className="fw-semibold">Total amount</div>
              <div>₹{Number(order.totalAmount || order.amount || 0).toLocaleString()}</div>
            </div>
          </div>
          <button className="btn btn-primary me-2" onClick={() => navigate('/orders')}>
            View My Orders
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/home')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
