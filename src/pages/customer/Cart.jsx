import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../../services/CartServices';
import { getUserId, isLoggedIn, logout } from '../../utils/AuthUtils';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingItemId, setProcessingItemId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    if (!isLoggedIn() || !userId) {
      logout();
      navigate('/login');
      return;
    }

    fetchCart();
  }, [navigate, userId]);

  const fetchCart = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getCartItems(userId);
      const data = response.data;
      const items = Array.isArray(data) ? data : data?.items || [];
      setCartItems(items);
    } catch (err) {
      console.error('Failed to fetch cart', err);
      setError('Unable to load your cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantity = async (item, delta) => {
    const cartItemId = item.cartItemId || item.id || item.cartItem?.id;
    const quantity = Number(item.quantity ?? item.qty ?? 1) + delta;
    if (!cartItemId || quantity < 1) return;

    setProcessingItemId(cartItemId);
    setError('');

    try {
      await updateCartItem(cartItemId, quantity);
      await fetchCart();
    } catch (err) {
      console.error('Failed to update cart item', err);
      setError('Unable to update quantity. Please try again.');
    } finally {
      setProcessingItemId(null);
    }
  };

  const handleRemove = async (item) => {
    const cartItemId = item.cartItemId || item.id || item.cartItem?.id;
    if (!cartItemId) return;

    setProcessingItemId(cartItemId);
    setError('');

    try {
      await removeFromCart(cartItemId);
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove cart item', err);
      setError('Unable to remove item. Please try again.');
    } finally {
      setProcessingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from your cart?')) {
      return;
    }

    setClearing(true);
    setError('');

    try {
      await clearCart(userId);
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart', err);
      setError('Unable to clear cart. Please try again.');
    } finally {
      setClearing(false);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const product = item.product || item;
    const price = Number(item.price ?? product.price ?? 0);
    const quantity = Number(item.quantity ?? item.qty ?? 1);
    return sum + price * quantity;
  }, 0);

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="mb-1">Shopping Cart</h4>
          <p className="text-muted mb-0">Review your items before you checkout.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/home')}>
          Continue Shopping
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading cart...</p>
        </div>
      ) : (
        <>
          {error && <div className="alert alert-danger">{error}</div>}

          {cartItems.length === 0 ? (
            <div className="alert alert-info">Your cart is empty.</div>
          ) : (
            <div className="row g-4">
              <div className="col-12 col-xl-8">
                <div className="list-group">
                  {cartItems.map((item) => {
                    const product = item.product || item;
                    const imgUrl = product.imageUrl || product.image_url || product.images?.[0];
                    const productName = product.productName || product.name || 'Product';
                    const price = Number(item.price ?? product.price ?? 0);
                    const quantity = Number(item.quantity ?? item.qty ?? 1);
                    const subtotal = price * quantity;
                    const cartItemId = item.cartItemId || item.id || item.cartItem?.id;
                    const processing = processingItemId === cartItemId;

                    return (
                      <div key={cartItemId || product.productId || product.id} className="card mb-3">
                        <div className="row g-0 align-items-center">
                          <div className="col-4 col-md-3">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={productName}
                                className="img-fluid rounded-start"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              />
                            ) : (
                              <div className="bg-light d-flex align-items-center justify-content-center rounded-start" style={{ minHeight: '120px' }}>
                                <span className="text-muted small">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="col-8 col-md-9">
                            <div className="card-body py-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="mb-1">{productName}</h6>
                                  <p className="mb-1 text-muted small">₹{price.toLocaleString()}</p>
                                </div>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                  onClick={() => handleRemove(item)}
                                  disabled={processing}
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 gap-sm-4">
                                <div className="input-group" style={{ width: '150px' }}>
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => handleQuantity(item, -1)}
                                    disabled={processing || quantity <= 1}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="text"
                                    className="form-control text-center"
                                    value={quantity}
                                    disabled
                                  />
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => handleQuantity(item, 1)}
                                    disabled={processing}
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="small text-muted">
                                  Subtotal: <strong>₹{subtotal.toLocaleString()}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Order Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Items ({cartItems.length})</span>
                      <strong>₹{cartTotal.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                      <span>Estimated total</span>
                      <strong>₹{cartTotal.toLocaleString()}</strong>
                    </div>
                    <button className="btn btn-primary w-100 mb-2" type="button" onClick={() => navigate('/checkout')}>
                      Checkout
                    </button>
                    <button
                      className="btn btn-outline-danger w-100"
                      type="button"
                      onClick={handleClearCart}
                      disabled={clearing}
                    >
                      {clearing ? 'Clearing...' : 'Clear Cart'}
                    </button>
                    <p className="text-muted small mt-3">
                      Checkout flow is not implemented in this page, but your cart is synced with the backend.
                    </p>
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

export default Cart;
