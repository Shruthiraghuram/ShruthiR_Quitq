import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return {};
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Place order
export const placeOrder = (userId, addressId, paymentMethod) => {
    return axios.post(
        `${BASE_URL}/orders/${userId}?addressId=${addressId}&paymentMethod=${paymentMethod}`,
        {},
        getAuthHeader()
    );
};

// Get orders by user
export const getOrdersByUser = (userId) => {
    return axios.get(`${BASE_URL}/orders/user/${userId}`, getAuthHeader());
};

// Get order by ID
export const getOrderById = (orderId) => {
    return axios.get(`${BASE_URL}/orders/${orderId}`, getAuthHeader());
};

// Get order items
export const getOrderItems = (orderId) => {
    return axios.get(`${BASE_URL}/orders/${orderId}/items`, getAuthHeader());
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
    return axios.put(
        `${BASE_URL}/orders/${orderId}/status?status=${status}`,
        {},
        getAuthHeader()
    );
};

// Update payment status
export const updatePaymentStatus = (orderId, paymentStatus) => {
    return axios.put(
        `${BASE_URL}/orders/${orderId}/payment?paymentStatus=${paymentStatus}`,
        {},
        getAuthHeader()
    );
};

// Get orders by seller
export const getOrdersBySeller = (sellerId) => {
    return axios.get(`${BASE_URL}/orders/seller/${sellerId}`, getAuthHeader());
};

// Cancel order
export const cancelOrder = (orderId) => {
    return axios.delete(`${BASE_URL}/orders/${orderId}/cancel`, getAuthHeader());
};