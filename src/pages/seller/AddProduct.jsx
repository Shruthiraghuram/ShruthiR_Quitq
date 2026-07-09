import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/ProductService';
import { getAllCategories } from '../../services/CategoryService';

// AddProduct form connected to Spring Boot backend via /api/products.
export default function AddProduct() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockNumber, setStockNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories()
      .then((response) => {
        setCategories(response.data);
        if (response.data && response.data.length > 0) {
          setCategoryId(String(response.data[0].categoryId));
        }
      })
      .catch((error) => {
        console.error('Failed to load categories:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert('Please select a valid category before submitting.');
      return;
    }

    const sellerId = Number(localStorage.getItem('sellerId')) || 3;

    const payload = {
      productName,
      description,
      price: Number(price),
      stockNumber: Number(stockNumber),
      categoryId: Number(categoryId),
      sellerId: Number(localStorage.getItem('sellerId')) || 3,
      imageUrl,
      available,
    };

    try {
      await addProduct(payload);
      alert('Product added successfully.');
      setProductName('');
      setDescription('');
      setPrice('');
      setStockNumber('');
      setCategoryId(String(categories?.[0]?.categoryId || ''));
      setImageUrl('');
      setAvailable(true);
    } catch (error) {
      console.error('Error adding product:', error);
      const message = error?.response?.data?.message || error.message || 'Failed to add product. Please try again.';
      alert(`Failed to add product: ${message}`);
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <button
            className="btn btn-outline-secondary mb-3"
            type="button"
            onClick={() => navigate('/seller/dashboard')}
          >
            Back to Dashboard
          </button>
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Add Product</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    className="form-control"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="row g-2">
                  <div className="col-6 mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min={0}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Stock Number</label>
                    <input
                      type="number"
                      className="form-control"
                      value={stockNumber}
                      onChange={(e) => setStockNumber(e.target.value)}
                      required
                      min={0}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-control"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="availableSwitch"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="availableSwitch">
                    Available
                  </label>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
