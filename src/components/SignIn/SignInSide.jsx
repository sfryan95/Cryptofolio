import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function Copyright(props) {
  return (
    <div>
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © Trademark ™ Patent Pending... '}
        <Link sx={{ color: 'white' }} component={RouterLink} to="/">
          Cryptofolio
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Not Financial Advice!'}
      </Typography>
    </div>
  );
}

export default function SignInSide({ setIsAuthenticated, setLoginSuccess, setLoginSuccessOpen }) {
  const [failedOpen, setLoginFailedOpen] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const loginAndRedirect = async (email, password) => {
    try {
      const response = await axios.post('/user/login', { email, password });
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setLoginSuccess(true);
        setLoginSuccessOpen(true);
        navigate('/');
      }
    } catch (e) {
      console.error('Error during signup:', e.message);
      if (e.response) {
        setLoginFailed(true);
        setLoginFailedOpen(true);
        console.error('Response data:', e.response.data);
        console.error('Response status:', e.response.status);
      }
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    if (!validateEmail(email)) {
      setEmailError('Invalid email format.');
      return;
    }
    setEmailError('');
    const password = data.get('password');
    loginAndRedirect(email, password);
  };

  return (
    <Grid container component="main" sx={{ height: '90vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={5}
        md={8}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={7} md={4} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Box sx={{ width: '100%' }}>
            <Collapse in={failedOpen}>
              <Alert
                variant="filled"
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setLoginFailedOpen(false);
                    }}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}>
                Incorrect email or password.
              </Alert>
            </Collapse>
          </Box>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus error={!!emailError} helperText={emailError} />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
