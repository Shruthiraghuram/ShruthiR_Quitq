import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  FaSearch, FaCamera, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getAllProducts, searchProducts, getProductsByCategory } from '../../services/ProductService';
import { getAllCategories } from '../../services/CategoryService';
import { addToCart } from '../../services/CartServices';
import { isLoggedIn, logout, getUserId } from '../../utils/AuthUtils';

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [voiceError, setVoiceError] = useState('');
    const [scannerError, setScannerError] = useState('');
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts();
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleSearch = async (term = searchTerm) => {
        const trimmedTerm = term?.trim() || '';
        setSearchTerm(trimmedTerm);

        if (trimmedTerm === '') {
            fetchProducts();
            return;
        }

        try {
            const response = await searchProducts(trimmedTerm);
            setProducts(response.data);
        } catch (err) {
            console.error('Error searching products:', err);
        }
    };

    const handleCategoryFilter = async (categoryId) => {
        try {
            const response = await getProductsByCategory(categoryId);
            setProducts(response.data);
        } catch (err) {
            console.error('Error filtering products:', err);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!isLoggedIn()) {
            alert('Please login to add items to cart!');
            navigate('/login');
            return;
        }
        const userId = getUserId();
        if (!userId) {
            alert('Unable to add to cart: missing user session. Please login again.');
            logout();
            navigate('/login');
            return;
        }
        try {
            await addToCart(userId, productId, 1);
            alert('Item added to cart!');
        } catch (err) {
            console.error('Add to cart failed', err);
            alert('Error adding to cart!');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const startVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setVoiceError('Voice search is not supported in this browser.');
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceError('');
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join(' ')
                .trim();

            if (transcript) {
                setSearchTerm(transcript);
                handleSearch(transcript);
            }
        };

        recognition.onerror = () => {
            setVoiceError('Could not capture your voice. Please try again.');
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const handleScanSuccess = (decodedText) => {
        if (!decodedText) {
            return;
        }

        setSearchTerm(decodedText);
        setScannerError('');
        setIsScannerOpen(false);
        handleSearch(decodedText);
    };

    const handleScanError = (error) => {
        if (error?.toString().includes('NotFoundException')) {
            return;
        }

        setScannerError('Unable to read the code. Please try again.');
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();

        return () => {
            recognitionRef.current?.stop();
        };
    }, []);

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold fs-4">🛍️ QuitQ</span>
                    <div className="d-flex flex-grow-1 mx-3 flex-wrap align-items-center">
                        <div className="flex-grow-1" style={{ minWidth: '240px' }}>
                            <div
    className="d-flex align-items-center w-100 border rounded bg-white overflow-hidden"
    style={{ maxWidth: "680px" }}>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none search-input"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                                    style={{ boxShadow: 'none' }}
                                />
                                <button
                                    className="btn search-action-button text-secondary"
                                    type="button"
                                    onClick={() => setIsScannerOpen(true)}
                                    title="Scan barcode or QR code"
                                    aria-label="Scan barcode or QR code"
                                >
                                    <FaCamera />
                                </button>
                                <button
                                    className="btn search-action-button text-secondary"
                                    type="button"
                                    onClick={startVoiceSearch}
                                    title="Voice search"
                                    aria-label="Voice search"
                                >
                                    {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                                </button>
                                <button
                                    className="btn search-icon-button d-flex align-items-center justify-content-center"
                                    type="button"
                                    onClick={() => handleSearch(searchTerm)}
                                    title="Search"
                                    aria-label="Search"
                                >
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-light"
                            onClick={() => navigate('/cart')}>
                            🛒 Cart
                        </button>
                        <button
                            className="btn btn-outline-light"
                            onClick={() => navigate('/orders')}>
                            📦 Orders
                        </button>
                        {isLoggedIn() ? (
                            <button
                                className="btn btn-danger"
                                onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <button
                                className="btn btn-light"
                                onClick={() => navigate('/login')}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Categories */}
            <div className="bg-light py-2">
                <div className="container-fluid">
                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={fetchProducts}>
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.categoryId}
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleCategoryFilter(category.categoryId)}>
                                {category.categoryName}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {voiceError && (
                <div className="container-fluid px-3 mt-3">
                    <div className="alert alert-warning py-2 mb-0 small">{voiceError}</div>
                </div>
            )}

            {isScannerOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center p-3" style={{ zIndex: 1050 }}>
                    <div className="bg-white rounded-4 shadow-lg p-3 w-100" style={{ maxWidth: '480px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">Scan barcode or QR code</h6>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setIsScannerOpen(false)}>
                                ✕
                            </button>
                        </div>
                        <Html5QrcodeScanner
                            fps={10}
                            qrbox={{ width: 220, height: 220 }}
                            disableFlip={false}
                            aspectRatio={1.0}
                            verbose={false}
                            onScan={handleScanSuccess}
                            onError={handleScanError}
                        />
                        {scannerError && (
                            <div className="alert alert-warning py-2 mt-2 mb-0 small">{scannerError}</div>
                        )}
                    </div>
                </div>
            )}

            {/* Products */}
            <div className="container-fluid mt-4 px-3">
                {loading ? (
                    <div className="text-center mt-5">
                        <div className="spinner-border text-primary"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="row">
                        {products.length === 0 ? (
                            <div className="text-center mt-5">
                                <h5>No products found!</h5>
                            </div>
                        ) : (
                            products.map(product => (
                                <div key={product.productId} className="col-6 col-md-3 mb-4">
                                    <div
            className="card h-100 shadow-sm"
            onClick={() => navigate(`/product/${product.productId}`)}
            style={{ cursor: "pointer" }}
        >
                                        {(product.imageUrl || product.image_url) ? (
                                            <img
                                                src={product.imageUrl || product.image_url}
                                                alt={product.productName}
                                                className="card-img-top"
                                                style={{ objectFit: 'cover', height: '180px' }}
                                            />
                                        ) : (
                                            <div className="bg-light d-flex align-items-center justify-content-center"
                                                style={{ height: '180px' }}>
                                                <span className="text-muted">No product image</span>
                                            </div>
                                        )}
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {product.productName}
                                            </h5>
                                            <p className="card-text text-muted small">
                                                {product.description}
                                            </p>
                                            <p className="card-text small">
                                                <span className="badge bg-secondary">
                                                    {product.category?.categoryName}
                                                </span>
                                            </p>
                                            <p className="card-text small">
                                                <strong>Seller:</strong> {product.seller?.name}
                                            </p>
                                            <h4 className="text-primary fw-bold">
                                                ₹{product.price.toLocaleString()}
                                            </h4>
                                            <p className="text-muted small">
                                                {product.stockNumber > 0 
                                                    ? `${product.stockNumber} in stock` 
                                                    : 'Out of stock'}
                                            </p>
                                        </div>
                                        <div className="card-footer bg-white border-0">
                                            
                                            <button
    className="btn btn-warning w-100 fw-bold"
    onClick={(e) => {
        e.stopPropagation();
        handleAddToCart(product.productId);
    }}
    disabled={!product.available}
>
    {product.available ? 'Add to Cart 🛒' : 'Out of Stock'}
</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;