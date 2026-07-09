import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Register seller
export const registerSeller = (sellerData) => {
    return axios.post(`${BASE_URL}/sellers/register`, sellerData);
};

// Login seller
export const loginSeller = (email, password) => {
    return axios.post(`${BASE_URL}/sellers/login?email=${email}&password=${password}`);
};

// Get seller by ID
export const getSellerById = (sellerId) => {
    return axios.get(`${BASE_URL}/sellers/${sellerId}`, getAuthHeader());
};

// Get all sellers
export const getAllSellers = () => {
    return axios.get(`${BASE_URL}/sellers`, getAuthHeader());
};

// Update seller
export const updateSeller = (sellerId, sellerData) => {
    return axios.put(`${BASE_URL}/sellers/${sellerId}`, sellerData, getAuthHeader());
};

// Delete seller
export const deleteSeller = (sellerId) => {
    return axios.delete(`${BASE_URL}/sellers/${sellerId}`, getAuthHeader());
};