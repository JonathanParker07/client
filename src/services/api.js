import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
    // Auth endpoints
    login: async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    },

    // Student endpoints with auth headers
    getAllStudents: async () => {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    searchStudents: async (query) => {
        const response = await axios.get(`${API_BASE_URL}/search`, {
            headers: getAuthHeader(),
            params: { query }
        });
        return response.data;
    },

    getStudentById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/user/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    createStudent: async (studentData) => {
        const response = await axios.post(`${API_BASE_URL}/user`, studentData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateStudent: async (id, studentData) => {
        const response = await axios.put(`${API_BASE_URL}/update/user/${id}`, studentData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteStudent: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/delete/user/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
