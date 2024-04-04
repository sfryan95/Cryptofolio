import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CustomLogo from '../images/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import axios from 'axios';
import './ResponsiveAppBar.css';

function ResponsiveAppBar({ isAuthenticated, setIsAuthenticated, setLoginSuccessOpen, theme, setTheme }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [avatar, setAvatar] = useState('');

  const pages = !isAuthenticated ? ['Home'] : ['Home', 'Portfolio'];
  const loginAndSignUpPages = ['Login', 'SignUp'];
  const menuPages = !isAuthenticated ? ['Home', 'Login', 'SignUp'] : ['Home', 'Portfolio', 'Dashboard', 'Logout'];
  const settings = ['Dashboard', 'Logout'];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page) => {
    const route = page === 'Home' ? '/' : `/${page.toLowerCase()}`;
    if (route !== location.pathname) {
      navigate(route);
    }
  };

  const handleToggleTheme = () => {
    setTheme(!theme);
  };

  const fetchAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.get('http://localhost:3002/user/avatar', config);
      const avatarUrl = response.data.avatarUrl;
      // console.log('Avatar URL:', avatarUrl);
      setAvatar('http://localhost:8080' + avatarUrl);
    } catch (e) {
      console.error('Failed to avatar:', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAvatar();
    }
  }, [isAuthenticated]);

  return (
    <AppBar position="static">
      <Container maxWidth={false} sx={{ p: 0, width: '100%' }}>
        <Toolbar disableGutters>
          <img src={CustomLogo} alt="logo" className="navbar-logo-img" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            Cryptofolio
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}>
              {menuPages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    handleNavigate(page);
                  }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            Cryptofolio
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  handleCloseNavMenu();
                  handleNavigate(page);
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>
          {!isAuthenticated ? (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              <IconButton sx={{ alignSelf: 'center' }} onClick={handleToggleTheme}>
                <DarkModeIcon />
              </IconButton>

              {loginAndSignUpPages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    handleNavigate(page);
                  }}
                  sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page}
                </Button>
              ))}
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton sx={{ alignSelf: 'center', mr: 1 }} onClick={handleToggleTheme}>
                <DarkModeIcon />
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Travis Howard" src={avatar} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}>
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === 'Logout') {
                        localStorage.removeItem('token');
                        handleCloseNavMenu();
                        setAvatar('');
                        setIsAuthenticated(false);
                        setLoginSuccessOpen(false);
                        navigate('/login');
                      } else {
                        handleCloseNavMenu();
                        handleNavigate(setting);
                      }
                    }}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
