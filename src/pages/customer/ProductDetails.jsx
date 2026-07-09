import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../../services/ProductService';
import { addToCart } from '../../services/CartServices';
import { isLoggedIn, getUserId, logout } from '../../utils/AuthUtils';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to load product details', err);
        setError('Unable to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increment = () => setQuantity((q) => Math.min(q + 1, 999));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  const handleAddToCart = async () => {
    if (!isLoggedIn()) {
      alert('Please login to add items to cart.');
      navigate('/login');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      logout();
      navigate('/login');
      return;
    }

    try {
      await addToCart(userId, id, quantity);
      alert('Item added to cart!');
      navigate('/cart');
    } catch (err) {
      console.error('Add to cart failed', err);
      alert('Unable to add item to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    alert('Buy now is not implemented yet. Please use the cart to checkout.');
  };

  const imageUrl =
    product?.images?.[0] || product?.imageUrl || product?.image_url || 'https://via.placeholder.com/800x800.png?text=No+Image';

  return (
    <div className="container my-4">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading product...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : product ? (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card">
              <img
                src={imageUrl}
                alt={product.productName || product.name || 'Product'}
                className="img-fluid rounded-3 w-100"
                style={{ objectFit: 'cover', maxHeight: '600px' }}
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <h2 className="fw-bold">{product.productName || product.name || 'Product'}</h2>
            <p className="text-muted mb-1">
              Category:{' '}
              <span className="text-primary">{product.category?.categoryName || product.category?.name || 'Uncategorized'}</span>
            </p>

            <h3 className="text-primary">₹{Number(product.price || product.productPrice || 0).toLocaleString()}</h3>

            <p className="mb-3">{product.description || product.productDescription || 'No description available.'}</p>

            <p>
              <strong>Stock status: </strong>
              {(product.stockNumber ?? product.quantity ?? product.stock ?? 0) > 0 ? (
                <span className="text-success">In stock ({product.stockNumber ?? product.quantity ?? product.stock})</span>
              ) : (
                <span className="text-danger">Out of stock</span>
              )}
            </p>

            <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-3">
              <div className="input-group" style={{ width: 150 }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={decrement}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  min={1}
                  max={product.stockNumber ?? product.quantity ?? product.stock ?? 999}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={increment}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="d-flex gap-2 w-100">
                <button
                  className="btn btn-warning fw-bold flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={(product.stockNumber ?? product.quantity ?? product.stock ?? 0) <= 0}
                >
                  Add to Cart
                </button>

                <button
                  className="btn btn-outline-primary flex-grow-1"
                  onClick={handleBuyNow}
                  disabled={(product.stockNumber ?? product.quantity ?? product.stock ?? 0) <= 0}
                >
                  Buy Now
                </button>
              </div>
            </div>

            <small className="text-muted">Secure payments • Easy returns • Please use the cart to complete checkout.</small>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">Product not found.</div>
      )}
    </div>
  );
}

export default ProductDetails;
