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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="portfolio-header">
          <ResponsiveAppBar isAuthenticated={isAuthenticated} />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/login" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
