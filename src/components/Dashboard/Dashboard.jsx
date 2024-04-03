import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

export default function Dashboard({ setIsAuthenticated }) {
  const [open, setOpen] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /[^a-zA-Z0-9]+/;
    return regex.test(password) && password.length >= 8;
  };

  const updateUserInfo = async (type, info) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:3002/user/update-${type}`;
    const data = {
      [type]: info,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.patch(url, data, config);
      console.log(response.status);
      if (response.status === 200) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (e) {
      console.error(`Error during ${type} update:`, e.message);
      if (e.response) {
        console.error('Response data:', e.response.data);
        console.error('Response status:', e.response.status);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    if (!validateEmail(email)) {
      setEmailError('Invalid email format.');
      return;
    }
    setEmailError('');
    updateUserInfo('email', email);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password');
    if (!validatePassword(password)) {
      setPasswordError('Invalid password format.');
      return;
    }
    setPasswordError('');
    updateUserInfo('password', password);
  };

  const handleConfirmAndDelete = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const confirmInput = data.get('Confirm');

    if (confirmInput === 'Confirm') {
      const token = localStorage.getItem('token');
      console.log(token);
      const url = 'http://localhost:3002/user/';
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      try {
        const response = await axios.delete(url, config);
        console.log(response);
        if (response.status === 204) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          handleClose();
          navigate('/signup');
        }
      } catch (e) {
        console.error('Deletion failed:', e.message);
        if (e.response) {
          console.error('Response data:', e.response.data);
          console.error('Response status:', e.response.status);
        }
      }
    } else {
      setDeleteError('Please enter "Confirm" to delete your account.');
      return;
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <Container component="main" /*  maxWidth="sm" */ sx={{ width: '825px' }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            pr: 3,
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <SettingsOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account Settings
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
          }}>
          <Box component="form" noValidate onSubmit={handleEmailSubmit} sx={{ mt: 3, width: '100%' }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Change Email:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" error={!!emailError} helperText={emailError || 'Please enter a valid email.'} />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ fontWeight: 'bold', mt: 3, mb: 2, width: '30%' }}>
              Submit
            </Button>
          </Box>
          <Box component="form" noValidate onSubmit={handlePasswordSubmit} sx={{ mt: 3, ml: 3, width: '100%' }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Change Password:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!passwordError}
                  helperText={passwordError || 'Password must be over 8 characters and include 1 symbol.'}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ fontWeight: 'bold', mt: 3, mb: 2, width: '30%' }}>
              Submit
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
          }}>
          <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Delete Account:
            </Typography>
            <React.Fragment>
              <Button variant="contained" color="error" onClick={handleClickOpen} sx={{ fontWeight: 'bold', mt: 3, mb: 2, width: '50%', pt: '10px', pb: '10px' }}>
                Delete Account
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                  component: 'form',
                  onSubmit: handleConfirmAndDelete,
                }}>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                  <DialogContentText>To delete account, please enter "Confirm". Action cannot be undone.</DialogContentText>
                  <TextField autoFocus required margin="dense" id="name" name="Confirm" label="Confirm" type="text" fullWidth variant="standard" error={!!deleteError} helperText={deleteError || 'Please enter "Confirm" to delete your account.'} />
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="error" type="submit">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          </Box>
          <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Upload Avatar Image:
            </Typography>
            <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />} sx={{ fontWeight: 'bold', mt: 3, mb: 2, width: '40%' }}>
              Upload file
              <VisuallyHiddenInput type="file" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
