import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Get all products
export const getAllProducts = () => {
    return axios.get(`${BASE_URL}/products`);
};

// Get product by ID
export const getProductById = (productId) => {
    return axios.get(`${BASE_URL}/products/${productId}`);
};

// Get products by category
export const getProductsByCategory = (categoryId) => {
    return axios.get(`${BASE_URL}/products/category/${categoryId}`);
};

// Get products by seller
export const getProductsBySeller = (sellerId) => {
    return axios.get(`${BASE_URL}/products/seller/${sellerId}`, getAuthHeader());
};

// Search products
export const searchProducts = (productName) => {
    return axios.get(`${BASE_URL}/products/search?productName=${productName}`);
};

// Add product
export const addProduct = (productData) => {
    return axios.post(`${BASE_URL}/products`, productData, getAuthHeader());
};

// Update product
export const updateProduct = (productId, productData) => {
    return axios.put(`${BASE_URL}/products/${productId}`, productData, getAuthHeader());
};

// Mark out of stock
export const markOutOfStock = (productId) => {
    return axios.put(`${BASE_URL}/products/${productId}/outofstock`, {}, getAuthHeader());
};

// Delete product
export const deleteProduct = (productId) => {
    return axios.delete(`${BASE_URL}/products/${productId}`, getAuthHeader());
};