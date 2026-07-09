// Save token after login
export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

// Get token
export const getToken = () => {
    return localStorage.getItem('token');
};

// Save user id after login
export const saveUserId = (userId) => {
    localStorage.setItem('userId', userId);
};

// Get user id
export const getUserId = () => {
    return localStorage.getItem('userId');
};

// Save role
export const saveRole = (role) => {
    localStorage.setItem('role', role);
};

// Get role
export const getRole = () => {
    return localStorage.getItem('role');
};

// Check if logged in
export const isLoggedIn = () => {
    return localStorage.getItem('token') !== null;
};

// Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
};