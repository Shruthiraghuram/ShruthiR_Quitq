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

// Add address
export const addAddress = (userId, addressData) => {
    return axios.post(`${BASE_URL}/addresses/${userId}`, addressData, getAuthHeader());
};

// Get all addresses by user
export const getAddressesByUser = (userId) => {
    return axios.get(`${BASE_URL}/addresses/${userId}`, getAuthHeader());
};

// Get address by ID
export const getAddressById = (addressId) => {
    return axios.get(`${BASE_URL}/addresses/address/${addressId}`, getAuthHeader());
};

// Update address
export const updateAddress = (addressId, addressData) => {
    return axios.put(`${BASE_URL}/addresses/address/${addressId}`, addressData, getAuthHeader());
};

// Delete address
    export const deleteAddress = (addressId) => {
    return axios.delete(
        `${BASE_URL}/addresses/address/${addressId}`,
        getAuthHeader()
    );
};