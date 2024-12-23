import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  Box,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../services/api';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // Add state for filter
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, [filterStatus]); // Add filterStatus as dependency since it affects loadStudents

  const loadStudents = async () => {
    try {
      const data = await api.getAllStudents();
      // Apply filter to the data
      const filteredData = filterStatus === 'all' 
        ? data 
        : data.filter(student => 
            filterStatus === 'received' 
              ? student.status === true || student.status === 'received'
              : student.status === false || student.status === 'not received'
          );
      setStudents(filteredData);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      if (query.trim()) {
        const data = await api.searchStudents(query);
        // Apply filter to the data
        const filteredData = filterStatus === 'all' 
          ? data 
          : data.filter(student => 
              filterStatus === 'received' 
                ? student.status === true || student.status === 'received'
                : student.status === false || student.status === 'not received'
            );
        setStudents(filteredData);
      } else {
        loadStudents(); // Load all students if search is empty
      }
    } catch (error) {
      console.error('Error searching students:', error);
      // If search fails (e.g., no results), show empty list
      setStudents([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or student ID..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="All"
            color={filterStatus === 'all' ? 'primary' : 'default'}
            onClick={() => {
              setFilterStatus('all');
              loadStudents();
            }}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="Received"
            color={filterStatus === 'received' ? 'primary' : 'default'}
            onClick={() => {
              setFilterStatus('received');
              loadStudents();
            }}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="Not Received"
            color={filterStatus === 'not received' ? 'primary' : 'default'}
            onClick={() => {
              setFilterStatus('not received');
              loadStudents();
            }}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Room Number</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{String(student.studentid).padStart(9, '0')}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{String(student.roomnum).padStart(4, '0')}</TableCell>
                <TableCell>Level {student.level}</TableCell>
                <TableCell>
                  <Chip
                    label={typeof student.status === 'boolean' 
                      ? (student.status ? 'received' : 'not received') 
                      : student.status}
                    color={student.status === 'received' || student.status === true ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {student.createdAt 
                    ? new Date(student.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Invalid Date'}
                </TableCell>
                <TableCell>
                  {student.updatedAt && student.updatedAt !== student.createdAt
                    ? new Date(student.updatedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/student/${student._id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/edit/${student._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(student._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default StudentList;
