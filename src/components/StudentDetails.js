import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { api } from '../services/api';

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      const data = await api.getStudentById(id);
      setStudent(data);
    } catch (error) {
      console.error('Error loading student:', error);
      navigate('/');
    }
  };

  if (!student) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Student Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              <strong>Name:</strong> {student.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Student ID:</strong> {student.studentid}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Room Number:</strong> {student.roomnum}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <strong>Level:</strong> {student.level}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" component="div">
              <strong>Status:</strong>{' '}
              <Chip
                label={student.status ? 'Active' : 'Inactive'}
                color={student.status ? 'success' : 'error'}
                size="small"
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/edit/${student._id}`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default StudentDetails;
