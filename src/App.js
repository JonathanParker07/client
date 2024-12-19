import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetails from './components/StudentDetails';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                    <StudentList />
                                </Container>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add"
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                    <StudentForm />
                                </Container>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                    <StudentForm />
                                </Container>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student/:id"
                        element={
                            <ProtectedRoute>
                                <Navbar />
                                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                                    <StudentDetails />
                                </Container>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;