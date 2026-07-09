import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductsBySeller, updateProduct } from '../../services/ProductService';
import { getAllCategories } from '../../services/CategoryService';

const LOW_STOCK_THRESHOLD = 10;

function stockStatus(stock) {
  if (stock === 0) return 'OUT_OF_STOCK';
  if (stock < LOW_STOCK_THRESHOLD) return 'LOW_STOCK';
  return 'IN_STOCK';
}

function stockRowClass(stock) {
  if (stock === 0)                    return 'table-danger';
  if (stock < LOW_STOCK_THRESHOLD)    return 'table-warning';
  return '';
}

export default function SellerInventory() {
  const navigate  = useNavigate();
  const sellerId  = localStorage.getItem('sellerId');

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [stockFilter, setStockFilter] = useState('');

  // Inline restock state
  const [restocking,     setRestocking]     = useState(null);   // productId
  const [newStockValue,  setNewStockValue]  = useState('');
  const [saving,         setSaving]         = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const [prodRes, catRes] = await Promise.all([
        getProductsBySeller(sellerId),
        getAllCategories(),
      ]);
      setProducts(prodRes.data  || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load inventory', err);
      setError('Unable to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sellerId) { navigate('/seller/login'); return; }
    loadInventory();
  }, [sellerId]);

  const getCategoryName = (product) =>
    product.categoryName ||
    categories.find((c) => c.categoryId === product.categoryId)?.categoryName ||
    '—';

  const openRestock = (product) => {
    setRestocking(product.productId);
    setNewStockValue(String(product.stockNumber ?? 0));
  };

  const cancelRestock = () => {
    setRestocking(null);
    setNewStockValue('');
  };

  const saveRestock = async (product) => {
    const newQty = parseInt(newStockValue, 10);
    if (isNaN(newQty) || newQty < 0) {
      alert('Please enter a valid stock quantity (0 or more).');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        productName:  product.productName,
        description:  product.description,
        price:        product.price,
        stockNumber:  newQty,
        categoryId:   product.categoryId,
        imageUrl:     product.imageUrl,
        available:    newQty > 0,       // auto-mark available when restocked
        sellerId:     Number(sellerId),
      };
      await updateProduct(product.productId, payload);
      await loadInventory();
      cancelRestock();
    } catch (err) {
      console.error('Failed to update stock', err);
      alert('Unable to update stock. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = !search.trim() ||
      p.productName?.toLowerCase().includes(search.toLowerCase()) ||
      getCategoryName(p).toLowerCase().includes(search.toLowerCase());

    const s = stockStatus(p.stockNumber ?? 0);
    const matchStock =
      !stockFilter ||
      (stockFilter === 'LOW'  && s === 'LOW_STOCK') ||
      (stockFilter === 'OUT'  && s === 'OUT_OF_STOCK') ||
      (stockFilter === 'IN'   && s === 'IN_STOCK');

    return matchSearch && matchStock;
  });

  // Summary counts
  const totalProducts  = products.length;
  const outOfStock     = products.filter((p) => (p.stockNumber ?? 0) === 0).length;
  const lowStock       = products.filter((p) => {
    const s = p.stockNumber ?? 0;
    return s > 0 && s < LOW_STOCK_THRESHOLD;
  }).length;
  const healthy        = totalProducts - outOfStock - lowStock;

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="mb-1">Inventory</h4>
          <p className="text-muted mb-0">Track stock levels and restock your products.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/seller/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center py-3">
            <div className="fs-3 fw-bold text-dark">{totalProducts}</div>
            <div className="small text-muted">Total Products</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center py-3" style={{ borderLeft: '4px solid #198754' }}>
            <div className="fs-3 fw-bold text-success">{healthy}</div>
            <div className="small text-muted">Healthy Stock</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center py-3" style={{ borderLeft: '4px solid #fd7e14' }}>
            <div className="fs-3 fw-bold text-warning">{lowStock}</div>
            <div className="small text-muted">Low Stock</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm text-center py-3" style={{ borderLeft: '4px solid #dc3545' }}>
            <div className="fs-3 fw-bold text-danger">{outOfStock}</div>
            <div className="small text-muted">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="d-flex flex-wrap gap-3 mb-3 small">
        <span><span className="badge bg-success me-1">●</span> In Stock (≥ {LOW_STOCK_THRESHOLD})</span>
        <span><span className="badge bg-warning text-dark me-1">●</span> Low Stock (&lt; {LOW_STOCK_THRESHOLD})</span>
        <span><span className="badge bg-danger me-1">●</span> Out of Stock (0)</span>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">All stock levels</option>
            <option value="IN">In Stock</option>
            <option value="LOW">Low Stock</option>
            <option value="OUT">Out of Stock</option>
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => { setSearch(''); setStockFilter(''); }}
          >
            Clear
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading inventory…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info">No products match the selected filters.</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle border">
              <thead className="table-dark">
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th className="text-center">Stock</th>
                  <th>Stock Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const stock  = product.stockNumber ?? 0;
                  const status = stockStatus(stock);
                  const rowCls = stockRowClass(stock);
                  const isOpen = restocking === product.productId;

                  return (
                    <tr key={product.productId} className={rowCls}>
                      <td>
                        <div className="fw-semibold">{product.productName}</div>
                        {status === 'LOW_STOCK' && (
                          <span className="badge bg-warning text-dark mt-1">Restock Alert</span>
                        )}
                        {status === 'OUT_OF_STOCK' && (
                          <span className="badge bg-danger mt-1">Out of Stock</span>
                        )}
                      </td>
                      <td>{getCategoryName(product)}</td>
                      <td>₹{Number(product.price).toLocaleString('en-IN')}</td>
                      <td className="text-center fw-bold">{stock}</td>
                      <td>
                        {status === 'IN_STOCK'    && <span className="badge bg-success">In Stock</span>}
                        {status === 'LOW_STOCK'   && <span className="badge bg-warning text-dark">Low Stock</span>}
                        {status === 'OUT_OF_STOCK'&& <span className="badge bg-danger">Out of Stock</span>}
                      </td>
                      <td className="text-center" style={{ minWidth: '220px' }}>
                        {isOpen ? (
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              style={{ width: '90px' }}
                              value={newStockValue}
                              min={0}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              disabled={saving}
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveRestock(product)}
                              disabled={saving}
                            >
                              {saving ? <span className="spinner-border spinner-border-sm" /> : 'Save'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={cancelRestock}
                              disabled={saving}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openRestock(product)}
                          >
                            Update Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="row d-md-none g-3">
            {filtered.map((product) => {
              const stock  = product.stockNumber ?? 0;
              const status = stockStatus(stock);
              const isOpen = restocking === product.productId;

              const cardBorder =
                status === 'OUT_OF_STOCK' ? '3px solid #dc3545' :
                status === 'LOW_STOCK'    ? '3px solid #fd7e14' :
                '3px solid #198754';

              return (
                <div key={product.productId} className="col-12">
                  <div className="card shadow-sm" style={{ borderLeft: cardBorder }}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                        <div>
                          <h6 className="mb-0 fw-semibold">{product.productName}</h6>
                          <small className="text-muted">{getCategoryName(product)}</small>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-1">
                          {status === 'IN_STOCK'    && <span className="badge bg-success">In Stock</span>}
                          {status === 'LOW_STOCK'   && <span className="badge bg-warning text-dark">Low Stock</span>}
                          {status === 'OUT_OF_STOCK'&& <span className="badge bg-danger">Out of Stock</span>}
                          {status === 'LOW_STOCK'   && <span className="badge bg-warning text-dark">⚠ Restock Alert</span>}
                        </div>
                      </div>
                      <div className="row g-1 small mb-3">
                        <div className="col-6"><span className="text-muted">Price: </span>₹{Number(product.price).toLocaleString('en-IN')}</div>
                        <div className="col-6"><span className="text-muted">Stock: </span><strong>{stock}</strong></div>
                      </div>

                      {isOpen ? (
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            className="form-control form-control-sm flex-fill"
                            value={newStockValue}
                            min={0}
                            onChange={(e) => setNewStockValue(e.target.value)}
                            disabled={saving}
                          />
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => saveRestock(product)}
                            disabled={saving}
                          >
                            {saving ? <span className="spinner-border spinner-border-sm" /> : 'Save'}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={cancelRestock}
                            disabled={saving}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          onClick={() => openRestock(product)}
                        >
                          Update Stock
                        </button>
                      )}
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
