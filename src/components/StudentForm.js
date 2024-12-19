import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { api } from '../services/api';

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    studentid: '',
    roomnum: '',
    level: '',
    status: true,
  });

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  const loadStudent = async () => {
    try {
      const data = await api.getStudentById(id);
      setFormData(data);
    } catch (error) {
      console.error('Error loading student:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ['studentid', 'roomnum', 'level'];
    const finalValue = numberFields.includes(name) ? Number(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      if (id) {
        await api.updateStudent(id, formData);
      } else {
        const response = await api.createStudent(formData);
        console.log('Create response:', response);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving student:', error.response?.data || error.message);
      alert('Error saving student: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {id ? 'Edit Student' : 'Add New Student'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student ID"
                name="studentid"
                type="number"
                value={formData.studentid}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomnum"
                type="number"
                value={formData.roomnum}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Level"
                name="level"
                type="number"
                value={formData.level}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleStatusChange}
                    color="primary"
                  />
                }
                label="Active Status"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mr: 1 }}
              >
                {id ? 'Update' : 'Create'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StudentForm;
