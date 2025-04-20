import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Container, 
  Divider, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  createTheme,
  ThemeProvider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SavingsIcon from '@mui/icons-material/Savings';
import StarIcon from '@mui/icons-material/Star';

// Custom dark fitness theme with teal accents
const fitnessTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(24,239,199)', // Bright teal
      light: 'rgb(93,255,224)', // Light teal
      dark: 'rgb(0,187,151)', // Dark teal
    },
    secondary: {
      main: 'rgb(255,97,140)', // Coral pink for accents
      light: 'rgb(255,146,173)',
      dark: 'rgb(199,60,99)',
    },
    background: {
      default: 'rgb(32,33,39)', // Dark background
      paper: 'rgb(42,43,49)', // Slightly lighter than default
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: 'rgb(24,239,199)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.3px',
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0, 0, 0, 0.2)',
    '0px 4px 16px rgba(0, 0, 0, 0.3)',
    // ...rest of the shadows
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, rgba(52,53,69,0.8), rgba(38,39,45,0.95))',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

const FitnessPaymentPage = () => {
  const theme = fitnessTheme;

  const plans = [
    {
      title: "Basic Fit",
      price: "₹3,999",
      period: "3 months",
      icon: <FitnessCenterIcon fontSize="large" />,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      imageAlt: "Person using gym equipment",
      features: [
        "Unlimited gym access",
        "2 personal training sessions",
        "Basic fitness assessment",
        "Access to group classes",
        "Mobile app access"
      ],
      highlights: [
        { icon: <AccessTimeFilledIcon />, text: "3 Month Commitment" },
        { icon: <SavingsIcon />, text: "₹1,333/month" }
      ],
      buttonText: "Choose Plan",
      color: theme.palette.primary.light
    },
    {
      title: "Power Fit",
      price: "₹6,999",
      period: "6 months",
      icon: <LocalFireDepartmentIcon fontSize="large" />,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      imageAlt: "Group fitness class",
      features: [
        "Unlimited gym access",
        "6 personal training sessions",
        "Detailed fitness assessment",
        "Nutrition consultation",
        "Custom workout plan",
        "Priority booking for classes"
      ],
      highlights: [
        { icon: <AccessTimeFilledIcon />, text: "6 Month Commitment" },
        { icon: <SavingsIcon />, text: "₹1,166/month" }
      ],
      buttonText: "Choose Plan",
      color: theme.palette.primary.main,
      popular: true
    },
    {
      title: "Elite Fit",
      price: "₹11,999",
      period: "12 months",
      icon: <SportsGymnasticsIcon fontSize="large" />,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      imageAlt: "Personal training session",
      features: [
        "24/7 gym access",
        "12 personal training sessions",
        "Advanced fitness assessment",
        "Personalized nutrition plan",
        "Quarterly body composition analysis",
        "Recovery sessions",
        "Premium app features"
      ],
      highlights: [
        { icon: <AccessTimeFilledIcon />, text: "12 Month Commitment" },
        { icon: <SavingsIcon />, text: "₹999/month" }
      ],
      buttonText: "Choose Plan",
      color: theme.palette.secondary.main
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        flexGrow: 1, 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden'
      }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            pt: 15, 
            pb: 12,
            position: 'relative',
            overflow: 'hidden',
            background: `linear-gradient(145deg, rgb(32,33,39) 30%, rgb(42,43,59) 100%)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
              zIndex: 0
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 70% 30%, ${theme.palette.primary.main}20 0%, transparent 60%)`,
              zIndex: 1
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(120deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Elevate Your Fitness Journey
            </Typography>
            <Typography 
              variant="h5" 
              align="center" 
              color="text.secondary" 
              paragraph 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                fontWeight: 'normal',
                mb: 6
              }}
            >
              Invest in yourself with our premium membership plans designed to transform your body and mind.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  borderRadius: '40px', 
                  px: 5, 
                  py: 1.8,
                  fontSize: '1.1rem',
                  boxShadow: '0 10px 25px rgba(24,239,199, 0.3)',
                  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    boxShadow: '0 12px 30px rgba(24,239,199, 0.5)',
                  }
                }}
                endIcon={<ArrowForwardIcon />}
              >
                View Memberships
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Container maxWidth="lg" sx={{ py: 12, position: 'relative' }}>
          <Box 
            sx={{
              position: 'absolute',
              top: '15%',
              right: '5%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.palette.primary.main}20, transparent 70%)`,
              zIndex: 0
            }}
          />
          <Box 
            sx={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.palette.secondary.main}15, transparent 70%)`,
              zIndex: 0
            }}
          />
          
          <Typography
            variant="h3"
            align="center"
            color="text.primary"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 2 }}
          >
            Choose Your Membership
          </Typography>
          
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: '700px', mx: 'auto', fontWeight: 'normal' }}
          >
            Flexible plans designed to fit your goals and commitment level
          </Typography>
          
          <Grid container spacing={5} justifyContent="center" sx={{ position: 'relative', zIndex: 1 }}>
            {plans.map((plan) => (
              <Grid 
                item 
                key={plan.title} 
                xs={12} 
                sm={6} 
                md={4}
              >
                <Card 
                  elevation={plan.popular ? 6 : 2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    background: plan.popular 
                      ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`
                      : theme.palette.background.paper,
                    ':hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    },
                    border: plan.popular ? `2px solid ${plan.color}` : 'none',
                    ...(plan.popular && {
                      transform: 'scale(1.05)',
                    })
                  }}
                >
                  {plan.popular && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 0, 
                        bgcolor: plan.color,
                        color: 'background.default',
                        py: 0.8,
                        px: 3,
                        borderTopLeftRadius: 30,
                        borderBottomLeftRadius: 30,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    height="140"
                    image={plan.image}
                    alt={plan.imageAlt}
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderBottom: `1px solid rgba(255,255,255,0.1)`
                    }}
                  />
                  <Box sx={{ 
                    p: 4,
                    background: `linear-gradient(120deg, ${theme.palette.background.default}80, ${theme.palette.background.paper})`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ 
                        color: plan.color, 
                        mr: 2, 
                        bgcolor: `${plan.color}20`,
                        p: 1.5,
                        borderRadius: '12px'
                      }}>
                        {plan.icon}
                      </Box>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        {plan.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 2 }}>
                      <Typography component="h2" variant="h3" color="text.primary" fontWeight="bold">
                        {plan.price}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" ml={1}>
                        {plan.period}
                      </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {plan.highlights.map((highlight, idx) => (
                        <Grid item xs={6} key={idx}>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: 2,
                            p: 1.5
                          }}>
                            <Box sx={{ color: plan.color, mb: 1 }}>
                              {highlight.icon}
                            </Box>
                            <Typography variant="caption" align="center">
                              {highlight.text}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  <Divider sx={{ opacity: 0.1 }} />
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <List dense>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ py: 1.2, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: '36px' }}>
                            <CheckCircleIcon sx={{ color: plan.color, fontSize: '1.3rem' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ fontSize: '0.95rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions sx={{ p: 4, pt: 1, pb: 4 }}>
                    <Button 
                      fullWidth 
                      variant={plan.popular ? "contained" : "outlined"} 
                      sx={{ 
                        borderRadius: '40px', 
                        py: 1.8,
                        fontSize: '1rem',
                        fontWeight: 'medium',
                        bgcolor: plan.popular ? plan.color : 'transparent',
                        borderColor: plan.color,
                        color: plan.popular ? theme.palette.background.default : plan.color,
                        boxShadow: plan.popular ? `0 10px 20px ${plan.color}40` : 'none',
                        '&:hover': {
                          bgcolor: plan.popular ? plan.color : `${plan.color}20`,
                          borderColor: plan.color,
                          boxShadow: plan.popular ? `0 12px 25px ${plan.color}50` : `0 8px 16px ${plan.color}30`
                        }
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Benefits Section */}
        <Box sx={{ 
          py: 10, 
          bgcolor: 'rgba(15,16,20,0.8)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
            zIndex: 0
          }
        }}>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h3"
              align="center"
              color="text.primary"
              fontWeight="bold"
              gutterBottom
              sx={{ mb: 6 }}
            >
              Why Choose Us
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 4, 
                  height: '100%',
                  bgcolor: 'rgba(42,43,49,0.7)',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ 
                    color: theme.palette.primary.main,
                    bgcolor: `${theme.palette.primary.main}20`,
                    p: 2,
                    borderRadius: '50%',
                    mb: 3
                  }}>
                    <FitnessCenterIcon sx={{ fontSize: '2.5rem' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    State-of-the-Art Equipment
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Access to premium fitness equipment, including the latest cardio machines, free weights, and functional training zones.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 4, 
                  height: '100%',
                  bgcolor: 'rgba(42,43,49,0.7)',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ 
                    color: theme.palette.primary.main,
                    bgcolor: `${theme.palette.primary.main}20`,
                    p: 2,
                    borderRadius: '50%',
                    mb: 3
                  }}>
                    <StarIcon sx={{ fontSize: '2.5rem' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Expert Trainers
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our certified personal trainers create customized workout plans to help you achieve your fitness goals efficiently.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 4, 
                  height: '100%',
                  bgcolor: 'rgba(42,43,49,0.7)',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Box sx={{ 
                    color: theme.palette.primary.main,
                    bgcolor: `${theme.palette.primary.main}20`,
                    p: 2,
                    borderRadius: '50%',
                    mb: 3
                  }}>
                    <LocalFireDepartmentIcon sx={{ fontSize: '2.5rem' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    Diverse Classes
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Choose from over 50 weekly classes including HIIT, yoga, spinning, and more to keep your workouts engaging and effective.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Call to Action */}
        <Box sx={{ 
          py: 12,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          color: 'black',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)',
            zIndex: 1
          }
        }}>
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h3" align="center" gutterBottom fontWeight="bold" sx={{ mb: 3, color: 'black' }}>
              Transform Your Body Today
            </Typography>
            <Typography variant="h6" align="center" paragraph sx={{ mb: 6, fontWeight: 'normal', color: 'rgba(0,0,0,0.8)', maxWidth: '800px', mx: 'auto' }}>
              Join our fitness community and start your journey towards a healthier, stronger you.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  borderRadius: '40px', 
                  px: 6, 
                  py: 2,
                  fontSize: '1.1rem',
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.primary.main,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: theme.palette.background.default,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.25)'
                  }
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Start Your Journey
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: 'rgba(22,23,29,0.95)', p: 8, pt: 10, pb: 8 }} component="footer">
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color={theme.palette.primary.main}>
                  FitFusion
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                  Transforming lives through fitness, nutrition, and wellness since 2015.
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  {/* Social icons would go here */}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                  Services
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Personal Training</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Nutrition Coaching</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Group Classes</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Fitness Assessment</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                  Company
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>About Us</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Our Trainers</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Careers</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Contact</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                  Legal
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Privacy Policy</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Terms of Service</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>Membership Agreement</Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 5, opacity: 0.1 }} />
            
            <Typography variant="body2" color="text.secondary" align="center">
              {'©️ '}
              {new Date().getFullYear()}
              {' FitFusion. All rights reserved.'}
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default FitnessPaymentPage;