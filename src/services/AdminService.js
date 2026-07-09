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

export const loginAdmin = (email, password) => {
    return axios.post(`${BASE_URL}/admin/login`, null, {
        params: { email, password }
    });
};

export const getDashboard = () => {
    return axios.get(`${BASE_URL}/admin/dashboard`, getAuthHeader());
};

export const getUsers = () => {
    return axios.get(`${BASE_URL}/admin/users`, getAuthHeader());
};

export const getSellers = () => {
    return axios.get(`${BASE_URL}/admin/sellers`, getAuthHeader());
};

export const getProducts = () => {
    return axios.get(`${BASE_URL}/admin/products`, getAuthHeader());
};

export const getOrders = () => {
    return axios.get(`${BASE_URL}/admin/orders`, getAuthHeader());
};

export const deleteUser = (userId) => {
    return axios.delete(`${BASE_URL}/admin/users/${userId}`, getAuthHeader());
};

export const deleteSeller = (sellerId) => {
    return axios.delete(`${BASE_URL}/admin/sellers/${sellerId}`, getAuthHeader());
};
