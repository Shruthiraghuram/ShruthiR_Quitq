import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import SellerLogin from './pages/auth/SellerLogin'
import SellerRegister from './pages/auth/SellerRegister'
import Home from './pages/customer/Home'
import ProductDetails from './pages/customer/ProductDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderSuccess from './pages/customer/OrderSuccess';
import SellerDashboard from './pages/seller/SellerDashboard'
import ManageProducts from './pages/seller/ManageProducts';
import SellerOrders from './pages/seller/SellerOrders';
import AddProduct from './pages/seller/AddProduct';
import AdminLogin from "./pages/auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SellerInventory from './pages/seller/SellerInventory';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<ManageProducts />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/seller/inventory" element={<SellerInventory />} />
      </Routes>
    </Router>
  )
}

export default App