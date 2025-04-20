import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, IconButton, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
// Import icons
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Restaurant as FoodIcon,
  LocalDining as MealIcon,
  FitnessCenter as WorkoutIcon,
  Forum as CommunityIcon,
  Payment as PaymentIcon,
  OndemandVideo as VideoIcon
} from '@mui/icons-material';
import ProfileSetup from './auth/ProfileSetup';

// Primary colors
const PRIMARY_BG = 'rgb(32,33,39)';
const ACCENT_COLOR = 'rgb(24,239,199)';
const ACCENT_HOVER = 'rgba(24,239,199,0.15)';
const ACCENT_SELECTED = 'rgba(24,239,199,0.25)';
const TEXT_COLOR = '#ffffff';
const SECONDARY_BG = 'rgb(38,40,48)';
const drawerWidth = 260;

// Custom styled components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
  minHeight: '70px',
  ...theme.mixins.toolbar,
}));

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: ACCENT_COLOR,
    color: ACCENT_COLOR,
    boxShadow: `0 0 0 2px ${PRIMARY_BG}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const LogoText = styled(Typography)(() => ({
  fontFamily: '"Inter", "Poppins", "Roboto", sans-serif',
  fontWeight: 700,
  letterSpacing: '0.5px',
  background: `linear-gradient(45deg, ${ACCENT_COLOR}, #7fffd4)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

// Logout page with redirect functionality
const LogoutPage = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Handle logout logic here
    const handleLogout = () => {
      console.log("Logging out...");
      // Redirect to login page after logout
      setTimeout(() => {
        navigate('/');
      }, 1000);
    };
    
    handleLogout();
  }, [navigate]);
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Typography variant="h5">Logging out...</Typography>
    </Box>
  );
};

// Navigation bar component with routing
const NavbarWithRouting = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Workout Plans', icon: <WorkoutIcon />, path: '/workouts' },
    { text: 'Meal Plans', icon: <MealIcon />, path: '/meal-plan' },
    { text: 'Food Nutrition', icon: <FoodIcon />, path: '/food-nutrition' },
    { text: 'Ask AI', icon: <CommunityIcon />, path: '/ask-ai' },
  ];

  const bottomNavItems = [
    { text: 'Profile', icon: <SettingsIcon />, badge: null, path: '/profile-setup' },
    { text: 'Logout', icon: <LogoutIcon />, badge: null, path: '/logout' },
  ];

  // Function to handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 88,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 88,
            boxSizing: 'border-box',
            backgroundColor: PRIMARY_BG,
            color: TEXT_COLOR,
            borderRight: 'none',
            transition: 'width 0.2s ease-in-out',
            overflowX: 'hidden',
            height: '100vh',
            padding: '10px',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
            },
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle} sx={{ color: TEXT_COLOR }}>
            <MenuIcon />
          </IconButton>
          {open && (
            <LogoText variant="h4" noWrap component="div">
          H&F
            </LogoText>
          )}
        </DrawerHeader>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
        
        {/* Main navigation items */}
        <List sx={{ px: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: ACCENT_SELECTED,
                    '&:hover': {
                      backgroundColor: ACCENT_HOVER,
                    },
                    '& .MuiListItemIcon-root': {
                      color: ACCENT_COLOR,
                    },
                    '& .MuiTypography-root': {
                      fontWeight: 600,
                      color: ACCENT_COLOR,
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: TEXT_COLOR,
                  }}
                >
                  {item.badge ? (
                    <StyledBadge variant="dot">
                      {item.icon}
                    </StyledBadge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      '& .MuiTypography-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }}></Box>

        {/* Bottom navigation items */}
        <List sx={{ px: 1, mb: 2 }}>
          {bottomNavItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  py: 1.2,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: ACCENT_SELECTED,
                    '&:hover': {
                      backgroundColor: ACCENT_HOVER,
                    },
                    '& .MuiListItemIcon-root': {
                      color: ACCENT_COLOR,
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: TEXT_COLOR,
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      '& .MuiTypography-root': {
                        fontWeight: 500,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main content area with proper spacing */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: SECONDARY_BG,
          minHeight: '100vh',
          width: `calc(100% - ${open ? drawerWidth : 88}px)`,
          transition: 'width 0.2s ease-in-out',
        }}
      >
        <Routes>
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="*" element={children} />
        </Routes>
      </Box>
    </Box>
  );
};

// Main app component that accepts children and doesn't include a Router
const PremiumLeftNavbar = ({ children }) => {
  // This component no longer includes a Router
  return <NavbarWithRouting>{children}</NavbarWithRouting>;
};

export default PremiumLeftNavbar;