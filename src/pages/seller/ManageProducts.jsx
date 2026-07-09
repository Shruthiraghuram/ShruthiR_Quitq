import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsBySeller, updateProduct, deleteProduct } from '../../services/ProductService';
import { getAllCategories } from '../../services/CategoryService';

export default function ManageProducts() {
  const navigate = useNavigate();
  const sellerId = localStorage.getItem('sellerId');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    stockNumber: '',
    categoryId: '',
    imageUrl: '',
    available: true,
  });

  useEffect(() => {
    if (!sellerId) {
      navigate('/seller/login');
      return;
    }

    const loadCategories = async () => {
      try {
        const categoryResponse = await getAllCategories();
        setCategories(categoryResponse.data || []);
      } catch (err) {
        console.error('Unable to load categories', err);
      }
    };

    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getProductsBySeller(sellerId);
        setProducts(response.data || []);
      } catch (err) {
        console.error('Unable to load seller products', err);
        setError('Unable to load your products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
    loadProducts();
  }, [navigate, sellerId]);

  const refreshProducts = async () => {
    try {
      const response = await getProductsBySeller(sellerId);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Unable to refresh product list', err);
    }
  };

  const openEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.productName || '',
      description: product.description || '',
      price: product.price ?? '',
      stockNumber: product.stockNumber ?? '',
      categoryId: String(product.categoryId || product.category?.categoryId || ''),
      imageUrl: product.imageUrl || '',
      available: product.available ?? true,
    });
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm('Delete this product? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);
      setProducts((current) => current.filter((item) => item.productId !== productId));
      if (selectedProduct?.productId === productId) {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Error deleting product', err);
      alert('Could not delete the product. Please try again.');
    }
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      return;
    }

    const productId = selectedProduct.productId;
    const categoryId = Number(formData.categoryId);

    if (!categoryId) {
      alert('Please select a valid category.');
      return;
    }

    const payload = {
      productName: formData.productName,
      description: formData.description,
      price: Number(formData.price),
      stockNumber: Number(formData.stockNumber),
      categoryId,
      imageUrl: formData.imageUrl,
      available: formData.available,
      sellerId: Number(sellerId),
    };

    try {
      await updateProduct(productId, payload);
      alert('Product updated successfully.');
      setSelectedProduct(null);
      await refreshProducts();
    } catch (err) {
      console.error('Error updating product', err);
      alert('Unable to update product. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="mb-1">Manage Products</h4>
          <p className="text-muted mb-0">Edit or delete products that belong to your seller account.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/seller/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {selectedProduct && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
              <div>
                <h5 className="card-title mb-1">Edit Product</h5>
                <p className="text-muted mb-0">Update existing product details, then save changes.</p>
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={handleCancelEdit}>
                Cancel Edit
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input
                    className="form-control"
                    value={formData.productName}
                    onChange={(e) => handleFormChange('productName', e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                    required
                    min={0}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.stockNumber}
                    onChange={(e) => handleFormChange('stockNumber', e.target.value)}
                    required
                    min={0}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-control"
                    value={formData.imageUrl}
                    onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.categoryId}
                    onChange={(e) => handleFormChange('categoryId', e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch mt-4 pt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="editAvailableSwitch"
                      checked={formData.available}
                      onChange={(e) => handleFormChange('available', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="editAvailableSwitch">
                      Available
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>
                <div className="col-12 d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">No products found for your seller account.</div>
      ) : (
        <>
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productId}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded bg-light border" style={{ width: 80, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.productName}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                              }}
                            />
                          ) : (
                            <span className="text-muted small">No Image</span>
                          )}
                        </div>
                        <div>
                          <div className="fw-semibold">{product.productName}</div>
                          <div className="text-muted small">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.category?.categoryName || product.categoryName || 'Uncategorized'}</td>
                    <td>₹{Number(product.price).toLocaleString()}</td>
                    <td>{product.stockNumber}</td>
                    <td>{product.available ? 'Available' : 'Unavailable'}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(product)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.productId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row d-md-none g-3">
            {products.map((product) => (
              <div key={product.productId} className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex mb-3 gap-3">
                      <div className="rounded bg-light border" style={{ width: 90, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.productName}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                            }}
                          />
                        ) : (
                          <span className="text-muted small">No Image</span>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-1">{product.productName}</h6>
                        <p className="text-muted small mb-1">{product.category?.categoryName || product.categoryName || 'Uncategorized'}</p>
                        <p className="mb-0 small">₹{Number(product.price).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => openEdit(product)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger flex-fill" onClick={() => handleDelete(product.productId)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
