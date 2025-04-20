import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  Avatar, 
  Chip, 
  ThemeProvider, 
  createTheme
} from '@mui/material';
import { 
  Close, 
  Restaurant, 
  LocalDining,
  BreakfastDining,
  LunchDining,
  DinnerDining,
  Fastfood,
  FlashOn,
  CalendarMonth,
  Notes,
  LocalGroceryStore
} from '@mui/icons-material';
import { useAuth } from '../../AuthContext';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';

// Theme configuration (same as before)
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'rgb(24, 239, 199)',
      light: 'rgb(93, 243, 217)',
      dark: 'rgb(18, 179, 149)',
      contrastText: 'rgb(32, 33, 39)',
    },
    secondary: {
      main: '#d6ff80',
      light: '#e0ff99',
      dark: '#b2d966',
    },
    background: {
      default: 'rgb(32, 33, 39)',
      paper: 'rgb(38, 40, 48)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.5px',
      marginBottom: '2rem',
      background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.2rem',
      marginBottom: '0.5rem',
      letterSpacing: '-0.3px',
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(145deg, rgba(38, 40, 48, 0.9) 0%, rgba(32, 33, 39, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          borderRadius: 12,
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 6px 12px rgba(24, 239, 199, 0.2)',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(24, 239, 199, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
  },
});

const MealPlanGenerator = () => {
  const [plansByWeek, setPlansByWeek] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeek2Loading, setIsWeek2Loading] = useState(false);
  const [isWeek3Loading, setIsWeek3Loading] = useState(false);
  const [isWeek4Loading, setIsWeek4Loading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useAuth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) return;
    const profileRef = doc(db, 'userProfiles', user.uid);
    getDoc(profileRef).then((docSnap) => {
      if (!docSnap.exists()) return;
      const profile = docSnap.data();
      setUserProfile(profile);
      const plansCol = collection(db, 'users', user.uid, 'mealPlans');
      const plansQuery = query(plansCol, orderBy('week'));
      getDocs(plansQuery)
        .then((snapshot) => {
          if (!snapshot.empty) {
            const savedPlans = {};
            snapshot.forEach((doc) => {
              const data = doc.data();
              savedPlans[data.week] = { plan: data.plan, id: doc.id };
            });
            setPlansByWeek(savedPlans);
          } else {
            generateWeek(1);
          }
        })
        .catch((err) => {
          console.error('Error loading saved meal plans:', err);
          generateWeek(1);
        });
    });
  }, [user]);

  const generateWeek = async (week) => {
    if (!userProfile) return;
    const endpoint = week===1 ? '/generate_meal_plan' : `/generate_week${week}_meal_plan`;
    const base = { ...userProfile };
    const body = week===1 ? base : {
      ...base,
      ...(week>1 && { previous_plan: plansByWeek[1]?.plan }),
      ...(week>2 && { previous_plan1: plansByWeek[1]?.plan, previous_plan2: plansByWeek[2]?.plan }),
      ...(week>3 && { previous_plan3: plansByWeek[3]?.plan })
    };
    const setLoad = week===1 ? setIsLoading : week===2 ? setIsWeek2Loading : week===3 ? setIsWeek3Loading : setIsWeek4Loading;
    setLoad(true); setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8001${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const plan = data.meal_plan || data;
      setPlansByWeek(prev => ({ ...prev, [week]: { plan } }));
      setSelectedWeek(week);
      // Save generated meal plan to Firestore
      if (user?.uid) {
        const plansCol = collection(db, 'users', user.uid, 'mealPlans');
        await addDoc(plansCol, { week, plan, createdAt: serverTimestamp() });
      }
    } catch (err) {
      console.error('Meal plan gen error:', err);
      setError(`Failed to generate Week ${week}`);
    } finally { setLoad(false); }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        flexGrow: 1, 
        padding: { xs: 2, sm: 4, md: 6 }, 
        backgroundColor: 'background.default', 
        minHeight: '40vh',
        backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(24, 239, 199, 0.05) 0%, rgba(24, 239, 199, 0) 60%)',
      }}>
        <Box 
          sx={{ 
            maxWidth: 1400, 
            margin: '0 auto',
            mt: { xs: 2, md: 4 },
            mb: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="h2" align="center" gutterBottom>
            H - Gen AI
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              maxWidth: 700, 
              margin: '0 auto 3rem auto', 
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 6,
            }}
          >
            Generate a personalized meal plan tailored to your dietary needs, fitness goals, and preferences using our advanced AI technology.
          </Typography>
          
          {/* Week tabs */}
          <Box sx={{ display:'flex', gap:2, justifyContent:'center', mb:4 }}>
            {[1,2,3,4].map(w => (
              <Button key={w} variant={selectedWeek===w?'contained':'outlined'} onClick={()=>setSelectedWeek(w)}>
                Week {w}
              </Button>
            ))}
          </Box>

          {/* Generate or Display Plan */}
          <Box>
            {!plansByWeek[selectedWeek]?.plan ? (
              <Box textAlign='center'>
                <Button variant='contained' onClick={()=>generateWeek(selectedWeek)} disabled={selectedWeek===1?isLoading:selectedWeek===2?isWeek2Loading:selectedWeek===3?isWeek3Loading:isWeek4Loading}>
                  {selectedWeek===1?isLoading?'Generating...':'Generate Week 1':selectedWeek===2?isWeek2Loading?'Generating...':'Generate Week 2':selectedWeek===3?isWeek3Loading?'Generating...':'Generate Week 3':isWeek4Loading?'Generating...':'Generate Week 4'}
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mb:4 }}>
                {Object.entries(plansByWeek[selectedWeek].plan).map(([day, meals])=> (
                  <Grid item xs={12} sm={6} md={3} key={day}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6'>{day}</Typography>
                        {['breakfast','lunch','dinner','snacks'].map(type=> (
                          <Box key={type} sx={{ mb:2 }}>
                            <Typography variant='subtitle2' sx={{ textTransform:'capitalize' }}>{type}</Typography>
                            <Typography>{meals[type]?.main}</Typography>
                            <Typography variant='body2' color='text.secondary'>{meals[type]?.calories} cal</Typography>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            {error && <Typography color='error' align='center'>{error}</Typography>}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MealPlanGenerator;