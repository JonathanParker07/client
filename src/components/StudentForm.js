import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
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
    level: '100',
    status: 'not received'
  });
  const [errors, setErrors] = useState({});

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

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'studentid':
        if (!/^\d{9}$/.test(value)) {
          error = 'Student ID must be exactly 9 digits';
        }
        break;
      case 'roomnum':
        if (!/^\d{4}$/.test(value)) {
          error = 'Room number must be exactly 4 digits';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow digits for studentid and roomnum
    if ((name === 'studentid' || name === 'roomnum') && value !== '') {
      if (!/^\d*$/.test(value)) {
        return; // Don't update if non-digit is entered
      }
    }

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Convert to number for specific fields before saving to state
    let finalValue = value;
    if (['studentid', 'roomnum', 'level'].includes(name) && value !== '') {
      finalValue = Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {
      studentid: validateField('studentid', formData.studentid.toString()),
      roomnum: validateField('roomnum', formData.roomnum.toString())
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      return; // Don't submit if there are errors
    }

    try {
      const submissionData = {
        ...formData,
        studentid: Number(formData.studentid),
        roomnum: Number(formData.roomnum),
        level: Number(formData.level),
        status: formData.status // Ensure status is sent as string
      };

      if (id) {
        await api.updateStudent(id, submissionData);
      } else {
        await api.createStudent(submissionData);
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
                type="text"
                placeholder="Enter 9 digits (e.g., 123456789)"
                value={formData.studentid}
                onChange={handleChange}
                error={!!errors.studentid}
                helperText={errors.studentid || "Must be exactly 9 digits"}
                required
                inputProps={{
                  pattern: "\\d{9}",
                  maxLength: 9,
                  inputMode: "numeric"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomnum"
                type="text"
                placeholder="Enter 4 digits (e.g., 1234)"
                value={formData.roomnum}
                onChange={handleChange}
                error={!!errors.roomnum}
                helperText={errors.roomnum || "Must be exactly 4 digits"}
                required
                inputProps={{
                  pattern: "\\d{4}",
                  maxLength: 4,
                  inputMode: "numeric"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                helperText="Select student level (100-400)"
              >
                {[100, 200, 300, 400].map((level) => (
                  <MenuItem key={level} value={level}>
                    Level {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                  row
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="received"
                    control={<Radio />}
                    label="Received"
                  />
                  <FormControlLabel
                    value="not received"
                    control={<Radio />}
                    label="Not Received"
                  />
                </RadioGroup>
              </FormControl>
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
