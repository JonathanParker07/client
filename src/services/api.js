import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
    // Auth endpoints
    login: async (credentials) => {
        try {
            console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
            const response = await axiosInstance.post('/auth/login', credentials);
            console.log('Login response:', response);
            return response.data;
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    },

    register: async (userData) => {
        try {
            console.log('Attempting registration to:', `${API_BASE_URL}/auth/register`);
            const response = await axiosInstance.post('/auth/register', userData);
            console.log('Registration response:', response);
            return response.data;
        } catch (error) {
            console.error('Registration error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    },

    // Student endpoints with auth headers
    getAllStudents: async () => {
        try {
            console.log('Attempting to fetch all students from:', `${API_BASE_URL}/users`);
            const response = await axiosInstance.get('/users', {
                headers: getAuthHeader()
            });
            console.log('Get all students response:', response);
            return response.data;
        } catch (error) {
            console.error('Get all students error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    },

    searchStudents: async (query) => {
        try {
            console.log('Attempting to search students with query:', query, 'at:', `${API_BASE_URL}/search`);
            const response = await axiosInstance.get('/search', {
                headers: getAuthHeader(),
                params: { query }
            });
            console.log('Search students response:', response);
            return response.data;
        } catch (error) {
            console.error('Search students error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    },

    getStudentById: async (id) => {
        try {
            console.log('Attempting to fetch student by id:', id, 'from:', `${API_BASE_URL}/user/${id}`);
            const response = await axiosInstance.get(`/user/${id}`, {
                headers: getAuthHeader()
            });
            console.log('Get student by id response:', response);
            return response.data;
        } catch (error) {
            console.error('Get student by id error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    },

    createStudent: async (studentData) => {
        try {
            console.log('Attempting to create student at:', `${API_BASE_URL}/user`);
            const response = await axiosInstance.post('/user', studentData, {
                headers: getAuthHeader()
            });
            console.log('Create student response:', response);
            return response.data;
        } catch (error) {
            console.error('Create student error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    },

    updateStudent: async (id, studentData) => {
        try {
            console.log('Attempting to update student by id:', id, 'at:', `${API_BASE_URL}/update/user/${id}`);
            const response = await axiosInstance.put(`/update/user/${id}`, studentData, {
                headers: getAuthHeader()
            });
            console.log('Update student response:', response);
            return response.data;
        } catch (error) {
            console.error('Update student error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    },

    deleteStudent: async (id) => {
        try {
            console.log('Attempting to delete student by id:', id, 'at:', `${API_BASE_URL}/delete/user/${id}`);
            const response = await axiosInstance.delete(`/delete/user/${id}`, {
                headers: getAuthHeader()
            });
            console.log('Delete student response:', response);
            return response.data;
        } catch (error) {
            console.error('Delete student error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            throw error;
        }
    }
};
