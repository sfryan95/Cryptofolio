import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home/Home.jsx';
import Portfolio from './components/Portfolio/Portfolio.jsx';
import ResponsiveAppBar from './components/ResponsiveAppBar.jsx';
import SignIn from './components/SignIn/SignInSide.jsx';
import SignUp from './components/Signup/SignUp.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [successOpen, setLoginSuccessOpen] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [theme, setTheme] = useState(true);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const userPreference = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const draculaTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#282a36',
        paper: '#282a36',
      },
      primary: {
        main: '#bd93f9',
      },
      secondary: {
        main: '#f8f8f2',
      },
      text: {
        primary: '#f8f8f2',
        secondary: '#6272a4',
      },
      action: {
        active: '#50fa7b',
        hover: '#44475a',
        selected: '#44475a',
        disabled: '#6272a4',
      },
      error: {
        main: '#ff6e6e',
      },
      warning: {
        main: '#ffb86c',
      },
      info: {
        main: '#8be9fd',
      },
      success: {
        main: '#50fa7b',
      },
    },
  });

  const apperance = theme ? userPreference : draculaTheme;

  return (
    <BrowserRouter>
      <ThemeProvider theme={apperance}>
        <CssBaseline />
        <div className="portfolio-header">
          <ResponsiveAppBar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setLoginSuccessOpen={setLoginSuccessOpen} theme={theme} setTheme={setTheme} />
        </div>
        <Routes>
          <Route path="/" element={<Home successOpen={successOpen} setLoginSuccessOpen={setLoginSuccessOpen} />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<SignIn setIsAuthenticated={setIsAuthenticated} setLoginSuccess={setLoginSuccess} setLoginSuccessOpen={setLoginSuccessOpen} />} />
          <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dashboard" element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
