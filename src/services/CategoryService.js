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

// Get all categories
export const getAllCategories = () => {
    return axios.get(`${BASE_URL}/categories`);
};

// Get category by ID
export const getCategoryById = (categoryId) => {
    return axios.get(`${BASE_URL}/categories/${categoryId}`);
};

// Add category
export const addCategory = (categoryData) => {
    return axios.post(`${BASE_URL}/categories`, categoryData, getAuthHeader());
};

// Update category
export const updateCategory = (categoryId, categoryData) => {
    return axios.put(`${BASE_URL}/categories/${categoryId}`, categoryData, getAuthHeader());
};

// Delete category
export const deleteCategory = (categoryId) => {
    return axios.delete(`${BASE_URL}/categories/${categoryId}`, getAuthHeader());
};