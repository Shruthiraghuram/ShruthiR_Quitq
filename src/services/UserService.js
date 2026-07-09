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

export const registerUser = (userData) => {
    return axios.post(`${BASE_URL}/users/register`, userData);
};

export const loginUser = (email, password) => {
    return axios.post(`${BASE_URL}/users/login?email=${email}&password=${password}`);
};


export const getUserById = (userId) => {
    return axios.get(`${BASE_URL}/users/${userId}`, getAuthHeader());
};


export const getAllUsers = () => {
    return axios.get(`${BASE_URL}/users`, getAuthHeader());
};


export const updateUser = (userId, userData) => {
    return axios.put(`${BASE_URL}/users/${userId}`, userData, getAuthHeader());
};


export const deleteUser = (userId) => {
    return axios.delete(`${BASE_URL}/users/${userId}`, getAuthHeader());
};