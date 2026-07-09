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

// Get cart items
export const getCartItems = (userId) => {
    return axios.get(`${BASE_URL}/cart/${userId}`, getAuthHeader());
};

// Add item to cart
export const addToCart = (userId, productId, quantity) => {
    return axios.post(
        `${BASE_URL}/cart/${userId}/add?productId=${productId}&quantity=${quantity}`,
        {},
        getAuthHeader()
    );
};

// Update cart item quantity
export const updateCartItem = (cartItemId, quantity) => {
    return axios.put(
        `${BASE_URL}/cart/item/${cartItemId}?quantity=${quantity}`,
        {},
        getAuthHeader()
    );
};

// Remove item from cart
export const removeFromCart = (cartItemId) => {
    return axios.delete(`${BASE_URL}/cart/item/${cartItemId}`, getAuthHeader());
};

// Clear cart
export const clearCart = (userId) => {
    return axios.delete(`${BASE_URL}/cart/${userId}/clear`, getAuthHeader());
};