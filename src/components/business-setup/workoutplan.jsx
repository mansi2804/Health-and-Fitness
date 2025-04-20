import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  ThemeProvider, 
  createTheme, 
  alpha,
  LinearProgress
} from '@mui/material';
import { FlashOn, CalendarMonth, Notes, FitnessCenter, YouTube } from '@mui/icons-material';
import { useAuth } from '../../AuthContext';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, addDoc, serverTimestamp, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';

// Modern dark theme configuration with accent color
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
      main: 'rgb(252, 128, 255)',
      light: 'rgb(253, 166, 255)',
      dark: 'rgb(204, 71, 207)',
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
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
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
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(24, 239, 199, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgb(24, 239, 199)',
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'rgb(24, 239, 199)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 16px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const WorkoutPlanGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height_cm: '',
    weight_kg: '',
    goal: '',
    diet: '',
    activity_level: '',
    workout_preference: '',
    allergies: '',
    user_suggestion: ''
  });
  const { user } = useAuth();
  const [plansByWeek, setPlansByWeek] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isWeek2Loading, setIsWeek2Loading] = useState(false);
  const [isWeek3Loading, setIsWeek3Loading] = useState(false);
  const [isWeek4Loading, setIsWeek4Loading] = useState(false);
  const totalDays = workoutPlan ? Object.keys(workoutPlan).length : 0;
  const completedCount = Object.values(plansByWeek[selectedWeek]?.completedDays || {}).filter(Boolean).length;
  const progressPercent = totalDays > 0 ? (completedCount / totalDays) * 100 : 0;

  useEffect(() => {
    if (user?.uid) {
      const plansCol = collection(db, 'users', user.uid, 'workoutPlans');
      const q = query(plansCol, orderBy('createdAt', 'asc'));
      getDocs(q).then(snapshot => {
        const plansData = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            week: data.week,
            plan: data.plan,
            completedDays: data.completedDays || {},
            status: data.status || 'generated'
          };
        });
        const newPlans = {};
        plansData.forEach(p => { newPlans[p.week] = p; });
        setPlansByWeek(newPlans);
        if (newPlans[selectedWeek]) handleWeekSelect(selectedWeek, newPlans[selectedWeek]);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const profileRef = doc(db, 'userProfiles', user.uid);
      getDoc(profileRef).then((docSnap) => {
        if (docSnap.exists()) setFormData(docSnap.data());
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    // reset previous weekly data
    setPlansByWeek({});
    setSelectedWeek(1);
    setWorkoutPlan(null);
    setIsWeek2Loading(false);
    setIsWeek3Loading(false);
    setIsWeek4Loading(false);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://127.0.0.1:8002/generate_workout_plan', formData);
      console.log('API response:', response.data);
      const data = response.data;
      const plan = data.workout_plan?.workout_plan || data.workout_plan || data;
      console.log('unwrapped plan:', plan);
      setWorkoutPlan(plan);
      if (user?.uid) {
        const plansCol = collection(db, 'users', user.uid, 'workoutPlans');
        const docRef = await addDoc(plansCol, {
          week: 1,
          plan,
          completedDays: {},
          status: 'generated',
          createdAt: serverTimestamp()
        });
        const newW1 = { id: docRef.id, week: 1, plan, completedDays: {}, status: 'generated' };
        setPlansByWeek(prev => ({ ...prev, 1: newW1 }));
        handleWeekSelect(1, newW1);
      }
    } catch (err) {
      setError('Failed to generate workout plan. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWeek2 = async () => {
    setIsWeek2Loading(true);
    try {
      const body = { ...formData, previous_plan: plansByWeek[1].plan };
      const response = await axios.post('http://127.0.0.1:8002/generate_week2_plan', body);
      const data = response.data;
      const plan2 = data.workout_plan?.workout_plan || data.workout_plan || data;
      if (user?.uid) {
        const plansCol = collection(db, 'users', user.uid, 'workoutPlans');
        const docRef2 = await addDoc(plansCol, {
          week: 2,
          plan: plan2,
          completedDays: {},
          status: 'generated',
          createdAt: serverTimestamp()
        });
        const newW2 = { id: docRef2.id, week: 2, plan: plan2, completedDays: {}, status: 'generated' };
        setPlansByWeek(prev => ({ ...prev, 2: newW2 }));
        handleWeekSelect(2, newW2);
      }
    } catch (err) {
      console.error('Week2 generation error:', err.response?.data || err);
      setError(`Failed to generate Week 2: ${(err.response?.data?.detail) || JSON.stringify(err.response?.data)}`);
    } finally {
      setIsWeek2Loading(false);
    }
  };

  const handleGenerateWeek3 = async () => {
    setIsWeek3Loading(true);
    try {
      const body = { ...formData, previous_plan1: plansByWeek[1].plan, previous_plan2: plansByWeek[2].plan };
      const response = await axios.post('http://127.0.0.1:8002/generate_week3_plan', body);
      const data = response.data;
      const plan3 = data.workout_plan?.workout_plan || data.workout_plan || data;
      if (user?.uid) {
        const col = collection(db, 'users', user.uid, 'workoutPlans');
        const docRef3 = await addDoc(col, { week: 3, plan: plan3, completedDays: {}, status: 'generated', createdAt: serverTimestamp() });
        const newW3 = { id: docRef3.id, week: 3, plan: plan3, completedDays: {}, status: 'generated' };
        setPlansByWeek(prev => ({ ...prev, 3: newW3 }));
        handleWeekSelect(3, newW3);
      }
    } catch (err) {
      console.error('Week3 generation error:', err.response?.data || err);
      setError(`Failed to generate Week 3: ${(err.response?.data?.detail) || JSON.stringify(err.response?.data)}`);
    } finally {
      setIsWeek3Loading(false);
    }
  };

  const handleGenerateWeek4 = async () => {
    setIsWeek4Loading(true);
    try {
      const body = { ...formData, previous_plan1: plansByWeek[1].plan, previous_plan2: plansByWeek[2].plan, previous_plan3: plansByWeek[3].plan };
      const response = await axios.post('http://127.0.0.1:8002/generate_week4_plan', body);
      const data = response.data;
      const plan4 = data.workout_plan?.workout_plan || data.workout_plan || data;
      if (user?.uid) {
        const col = collection(db, 'users', user.uid, 'workoutPlans');
        const docRef4 = await addDoc(col, { week: 4, plan: plan4, completedDays: {}, status: 'generated', createdAt: serverTimestamp() });
        const newW4 = { id: docRef4.id, week: 4, plan: plan4, completedDays: {}, status: 'generated' };
        setPlansByWeek(prev => ({ ...prev, 4: newW4 }));
        handleWeekSelect(4, newW4);
      }
    } catch (err) {
      console.error('Week4 generation error:', err.response?.data || err);
      setError(`Failed to generate Week 4: ${(err.response?.data?.detail) || JSON.stringify(err.response?.data)}`);
    } finally {
      setIsWeek4Loading(false);
    }
  };

  const handleWeekSelect = (week, data) => {
    setSelectedWeek(week);
    const weekData = data || plansByWeek[week];
    if (weekData) {
      setWorkoutPlan(weekData.plan);
      if (data) {
        setPlansByWeek(prev => ({ ...prev, [week]: weekData }));
      }
    } else {
      setWorkoutPlan(null);
    }
  };

  const toggleComplete = async (day) => {
    const weekData = plansByWeek[selectedWeek];
    const updated = { ...weekData.completedDays, [day]: !weekData.completedDays[day] };
    const allDone = weekData.plan && Object.keys(weekData.plan).length === Object.values(updated).filter(Boolean).length;
    if (user?.uid && weekData?.id) {
      const ref = doc(db, 'users', user.uid, 'workoutPlans', weekData.id);
      await updateDoc(ref, {
        [`completedDays.${day}`]: updated[day],
        ...(allDone && { status: 'completed' })
      });
      setPlansByWeek(prev => ({
        ...prev,
        [selectedWeek]: { ...weekData, completedDays: updated, status: allDone ? 'completed' : weekData.status }
      }));
    }
  };

  const w1 = plansByWeek[1] || {};
  const w1Comp = w1.completedDays ? Object.values(w1.completedDays).filter(Boolean).length : 0;
  const w2 = plansByWeek[2] || {};
  const w2Comp = Object.values(w2.completedDays || {}).filter(Boolean).length;
  const w3 = plansByWeek[3] || {};
  const w3Comp = Object.values(w3.completedDays || {}).filter(Boolean).length;

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
            F - Gen AI
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
            Generate a personalized workout plan tailored to your fitness goals, preferences, and physical attributes using our advanced AI technology.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 8
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<FlashOn />}
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{
                fontSize: '1.1rem',
                py: 1.8,
                px: 5,
                borderRadius: '50px',
                background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                color: 'rgb(32, 33, 39)',
                fontWeight: 700,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 12px 24px rgba(24, 239, 199, 0.3)',
                }
              }}
            >
              {isLoading ? 'Generating...' : 'Create Your Workout Plan'}
            </Button>
          </Box>

          {/* Error Message */}
          {error && (
            <Box 
              sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: alpha('#FF5252', 0.1), 
                border: '1px solid', 
                borderColor: '#FF5252', 
                borderRadius: 2, 
                color: '#FF5252',
                maxWidth: 800,
                mx: 'auto'
              }}
            >
              <Typography variant="body1">{error}</Typography>
            </Box>
          )}

          {/* Results Section with Week Tabs */}
          <Box sx={{ mt: 8, maxWidth: 1200, mx: 'auto' }}>
            {/* Week selector */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              {[1,2,3,4].map((w) => (
                <Button
                  key={w}
                  variant={selectedWeek === w ? 'contained' : 'outlined'}
                  onClick={() => handleWeekSelect(w)}
                >Week {w}</Button>
              ))}
            </Box>
            {/* Week 1 plan */}
            {selectedWeek === 1 && plansByWeek[1] && (
              <Box>
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Typography variant="subtitle1" align="center">{completedCount}/{totalDays} days completed</Typography>
                  <LinearProgress variant="determinate" value={progressPercent} />
                </Box>
                <Typography variant="h2" align="center" sx={{ mb: 5 }}>
                  Week {selectedWeek} Training Program
                </Typography>
                
                <Grid container spacing={4}>
                  {Object.entries(workoutPlan || {}).map(([day, details]) => (
                    <Grid item xs={12} md={6} key={day}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'visible',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -8,
                            left: 20,
                            right: 20,
                            height: 8,
                            background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }
                        }}
                      >
                        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              mb: 3,
                              p: 3,
                              borderBottom: '1px solid',
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, rgba(38, 40, 48, 0) 100%)`,
                            }}
                          >
                            <Box 
                              sx={{
                                color: 'rgb(32, 33, 39)',
                                background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                                padding: 1.2,
                                borderRadius: 2,
                                display: 'flex',
                                boxShadow: '0 4px 10px rgba(24, 239, 199, 0.3)',
                              }}
                            >
                              <CalendarMonth sx={{ fontSize: 24 }} />
                            </Box>
                            <Typography 
                              variant="h3" 
                              component="h3" 
                              sx={{ 
                                color: 'white',
                                fontWeight: 700,
                                letterSpacing: '0px',
                                fontSize: '1.3rem',
                                m: 0
                              }}
                            >
                              {day}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ px: 3, mb: 3 }}>
                            <Box 
                              sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                p: 2,
                                borderRadius: 2,
                                background: alpha(theme.palette.background.default, 0.4),
                                backdropFilter: 'blur(8px)',
                              }}
                            >
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <FlashOn sx={{ fontSize: 18 }} /> Goal:
                                </Box> 
                                {details.goal}
                              </Typography>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center', 
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <Notes sx={{ fontSize: 18 }} /> Focus:
                                </Box> 
                                {details.focus}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              color: 'primary.main', 
                              px: 3, 
                              mb: 2, 
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <FitnessCenter sx={{ fontSize: 20 }} /> 
                            Exercises
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, pb: 3, flex: 1 }}>
                            {details.exercises?.map((exercise, index) => (
                              <Paper 
                                key={index} 
                                elevation={0} 
                                sx={{ 
                                  p: 2.5, 
                                  borderRadius: 3,
                                  background: 'linear-gradient(145deg, rgba(46, 48, 58, 0.7) 0%, rgba(38, 40, 48, 0.7) 100%)',
                                  backdropFilter: 'blur(5px)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 4,
                                    background: 'linear-gradient(to bottom, rgb(24, 239, 199), rgb(93, 243, 217))',
                                  }
                                }}
                              >
                                <Typography 
                                  variant="h3" 
                                  component="h4" 
                                  sx={{ 
                                    fontSize: '1.05rem', 
                                    fontWeight: 700, 
                                    color: 'white', 
                                    mb: 1,
                                    pl: 0.5
                                  }}
                                >
                                  {exercise.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 6,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    mb: 1.5,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  }}
                                >
                                  {exercise.sets} • {exercise.reps}
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', pl: 0.5 }}>
                                  {exercise.notes}
                                </Typography>
                                {exercise.video?.startsWith('http') && (
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<YouTube />}
                                    component="a"
                                    href={exercise.video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                      borderRadius: '50px',
                                      borderColor: alpha(theme.palette.primary.main, 0.5),
                                      '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      }
                                    }}
                                  >
                                    Watch Demo
                                  </Button>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Button
                            variant="contained"
                            color={plansByWeek[selectedWeek].completedDays[day] ? 'success' : 'primary'}
                            onClick={() => toggleComplete(day)}
                          >
                            {plansByWeek[selectedWeek].completedDays[day] ? 'Completed' : 'Complete'}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {/* {completedCount === totalDays && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      onClick={handleGenerateWeek2}
                      disabled={isWeek2Loading}
                    >
                      {isWeek2Loading ? 'Generating Week 2...' : 'Generate Week 2 Plan'}
                    </Button>
                  </Box>
                )} */}
              </Box>
            )}
            {/* Generate Week 1 if absent */}
            {/* {selectedWeek === 1 && !plansByWeek[1] && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Week 1 Plan'}
                </Button>
              </Box>
            )} */}
            {/* Week 2 plan */}
            {selectedWeek === 2 && plansByWeek[2] && (
              <Box>
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Typography variant="subtitle1" align="center">{completedCount}/{totalDays} days completed</Typography>
                  <LinearProgress variant="determinate" value={progressPercent} />
                </Box>
                <Typography variant="h2" align="center" sx={{ mb: 5 }}>
                  Week {selectedWeek} Training Program
                </Typography>
                
                <Grid container spacing={4}>
                  {Object.entries(workoutPlan || {}).map(([day, details]) => (
                    <Grid item xs={12} md={6} key={day}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'visible',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -8,
                            left: 20,
                            right: 20,
                            height: 8,
                            background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }
                        }}
                      >
                        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              mb: 3,
                              p: 3,
                              borderBottom: '1px solid',
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, rgba(38, 40, 48, 0) 100%)`,
                            }}
                          >
                            <Box 
                              sx={{
                                color: 'rgb(32, 33, 39)',
                                background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                                padding: 1.2,
                                borderRadius: 2,
                                display: 'flex',
                                boxShadow: '0 4px 10px rgba(24, 239, 199, 0.3)',
                              }}
                            >
                              <CalendarMonth sx={{ fontSize: 24 }} />
                            </Box>
                            <Typography 
                              variant="h3" 
                              component="h3" 
                              sx={{ 
                                color: 'white',
                                fontWeight: 700,
                                letterSpacing: '0px',
                                fontSize: '1.3rem',
                                m: 0
                              }}
                            >
                              {day}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ px: 3, mb: 3 }}>
                            <Box 
                              sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                p: 2,
                                borderRadius: 2,
                                background: alpha(theme.palette.background.default, 0.4),
                                backdropFilter: 'blur(8px)',
                              }}
                            >
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <FlashOn sx={{ fontSize: 18 }} /> Goal:
                                </Box> 
                                {details.goal}
                              </Typography>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center', 
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <Notes sx={{ fontSize: 18 }} /> Focus:
                                </Box> 
                                {details.focus}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              color: 'primary.main', 
                              px: 3, 
                              mb: 2, 
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <FitnessCenter sx={{ fontSize: 20 }} /> 
                            Exercises
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, pb: 3, flex: 1 }}>
                            {details.exercises?.map((exercise, index) => (
                              <Paper 
                                key={index} 
                                elevation={0} 
                                sx={{ 
                                  p: 2.5, 
                                  borderRadius: 3,
                                  background: 'linear-gradient(145deg, rgba(46, 48, 58, 0.7) 0%, rgba(38, 40, 48, 0.7) 100%)',
                                  backdropFilter: 'blur(5px)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 4,
                                    background: 'linear-gradient(to bottom, rgb(24, 239, 199), rgb(93, 243, 217))',
                                  }
                                }}
                              >
                                <Typography 
                                  variant="h3" 
                                  component="h4" 
                                  sx={{ 
                                    fontSize: '1.05rem', 
                                    fontWeight: 700, 
                                    color: 'white', 
                                    mb: 1,
                                    pl: 0.5
                                  }}
                                >
                                  {exercise.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 6,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    mb: 1.5,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  }}
                                >
                                  {exercise.sets} • {exercise.reps}
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', pl: 0.5 }}>
                                  {exercise.notes}
                                </Typography>
                                {exercise.video?.startsWith('http') && (
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<YouTube />}
                                    component="a"
                                    href={exercise.video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                      borderRadius: '50px',
                                      borderColor: alpha(theme.palette.primary.main, 0.5),
                                      '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      }
                                    }}
                                  >
                                    Watch Demo
                                  </Button>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Button
                            variant="contained"
                            color={plansByWeek[selectedWeek].completedDays[day] ? 'success' : 'primary'}
                            onClick={() => toggleComplete(day)}
                          >
                            {plansByWeek[selectedWeek].completedDays[day] ? 'Completed' : 'Complete'}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {/* {completedCount === totalDays && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      onClick={handleGenerateWeek2}
                      disabled={isWeek2Loading}
                    >
                      {isWeek2Loading ? 'Generating Week 2...' : 'Generate Week 2 Plan'}
                    </Button>
                  </Box>
                )} */}
              </Box>
            )}
            {/* Generate Week 2 button */}
            {selectedWeek === 2 && !plansByWeek[2] && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                {w1Comp >= 2 ? (
                  <Button variant="contained" onClick={handleGenerateWeek2} disabled={isWeek2Loading}>
                    {isWeek2Loading ? 'Generating Week 2...' : 'Generate Week 2 Plan'}
                  </Button>
                ) : (
                  <Typography>Week 2 workouts unlock after completing at least 2 days of Week 1</Typography>
                )}
              </Box>
            )}
            {/* Week 3 plan */}
            {selectedWeek === 3 && plansByWeek[3] && (
              <Box>
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Typography variant="subtitle1" align="center">{completedCount}/{totalDays} days completed</Typography>
                  <LinearProgress variant="determinate" value={progressPercent} />
                </Box>
                <Typography variant="h2" align="center" sx={{ mb: 5 }}>
                  Week {selectedWeek} Training Program
                </Typography>
                
                <Grid container spacing={4}>
                  {Object.entries(workoutPlan || {}).map(([day, details]) => (
                    <Grid item xs={12} md={6} key={day}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'visible',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -8,
                            left: 20,
                            right: 20,
                            height: 8,
                            background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }
                        }}
                      >
                        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              mb: 3,
                              p: 3,
                              borderBottom: '1px solid',
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, rgba(38, 40, 48, 0) 100%)`,
                            }}
                          >
                            <Box 
                              sx={{
                                color: 'rgb(32, 33, 39)',
                                background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                                padding: 1.2,
                                borderRadius: 2,
                                display: 'flex',
                                boxShadow: '0 4px 10px rgba(24, 239, 199, 0.3)',
                              }}
                            >
                              <CalendarMonth sx={{ fontSize: 24 }} />
                            </Box>
                            <Typography 
                              variant="h3" 
                              component="h3" 
                              sx={{ 
                                color: 'white',
                                fontWeight: 700,
                                letterSpacing: '0px',
                                fontSize: '1.3rem',
                                m: 0
                              }}
                            >
                              {day}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ px: 3, mb: 3 }}>
                            <Box 
                              sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                p: 2,
                                borderRadius: 2,
                                background: alpha(theme.palette.background.default, 0.4),
                                backdropFilter: 'blur(8px)',
                              }}
                            >
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <FlashOn sx={{ fontSize: 18 }} /> Goal:
                                </Box> 
                                {details.goal}
                              </Typography>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center', 
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <Notes sx={{ fontSize: 18 }} /> Focus:
                                </Box> 
                                {details.focus}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              color: 'primary.main', 
                              px: 3, 
                              mb: 2, 
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <FitnessCenter sx={{ fontSize: 20 }} /> 
                            Exercises
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, pb: 3, flex: 1 }}>
                            {details.exercises?.map((exercise, index) => (
                              <Paper 
                                key={index} 
                                elevation={0} 
                                sx={{ 
                                  p: 2.5, 
                                  borderRadius: 3,
                                  background: 'linear-gradient(145deg, rgba(46, 48, 58, 0.7) 0%, rgba(38, 40, 48, 0.7) 100%)',
                                  backdropFilter: 'blur(5px)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 4,
                                    background: 'linear-gradient(to bottom, rgb(24, 239, 199), rgb(93, 243, 217))',
                                  }
                                }}
                              >
                                <Typography 
                                  variant="h3" 
                                  component="h4" 
                                  sx={{ 
                                    fontSize: '1.05rem', 
                                    fontWeight: 700, 
                                    color: 'white', 
                                    mb: 1,
                                    pl: 0.5
                                  }}
                                >
                                  {exercise.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 6,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    mb: 1.5,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  }}
                                >
                                  {exercise.sets} • {exercise.reps}
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', pl: 0.5 }}>
                                  {exercise.notes}
                                </Typography>
                                {exercise.video?.startsWith('http') && (
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<YouTube />}
                                    component="a"
                                    href={exercise.video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                      borderRadius: '50px',
                                      borderColor: alpha(theme.palette.primary.main, 0.5),
                                      '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      }
                                    }}
                                  >
                                    Watch Demo
                                  </Button>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Button
                            variant="contained"
                            color={plansByWeek[selectedWeek].completedDays[day] ? 'success' : 'primary'}
                            onClick={() => toggleComplete(day)}
                          >
                            {plansByWeek[selectedWeek].completedDays[day] ? 'Completed' : 'Complete'}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            {/* Generate Week 3 button */}
            {selectedWeek === 3 && !plansByWeek[3] && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                {w2Comp >= 2 ? (
                  <Button variant="contained" onClick={handleGenerateWeek3} disabled={isWeek3Loading}>
                    {isWeek3Loading ? 'Generating Week 3...' : 'Generate Week 3 Plan'}
                  </Button>
                ) : (
                  <Typography>Week 3 workouts unlock after completing at least 2 days of Week 2</Typography>
                )}
              </Box>
            )}
            {/* Week 4 plan */}
            {selectedWeek === 4 && plansByWeek[4] && (
              <Box>
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Typography variant="subtitle1" align="center">{completedCount}/{totalDays} days completed</Typography>
                  <LinearProgress variant="determinate" value={progressPercent} />
                </Box>
                <Typography variant="h2" align="center" sx={{ mb: 5 }}>
                  Week {selectedWeek} Training Program
                </Typography>
                
                <Grid container spacing={4}>
                  {Object.entries(workoutPlan || {}).map(([day, details]) => (
                    <Grid item xs={12} md={6} key={day}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'visible',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -8,
                            left: 20,
                            right: 20,
                            height: 8,
                            background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }
                        }}
                      >
                        <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              mb: 3,
                              p: 3,
                              borderBottom: '1px solid',
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, rgba(38, 40, 48, 0) 100%)`,
                            }}
                          >
                            <Box 
                              sx={{
                                color: 'rgb(32, 33, 39)',
                                background: 'linear-gradient(90deg, rgb(24, 239, 199) 0%, rgb(93, 243, 217) 100%)',
                                padding: 1.2,
                                borderRadius: 2,
                                display: 'flex',
                                boxShadow: '0 4px 10px rgba(24, 239, 199, 0.3)',
                              }}
                            >
                              <CalendarMonth sx={{ fontSize: 24 }} />
                            </Box>
                            <Typography 
                              variant="h3" 
                              component="h3" 
                              sx={{ 
                                color: 'white',
                                fontWeight: 700,
                                letterSpacing: '0px',
                                fontSize: '1.3rem',
                                m: 0
                              }}
                            >
                              {day}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ px: 3, mb: 3 }}>
                            <Box 
                              sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                p: 2,
                                borderRadius: 2,
                                background: alpha(theme.palette.background.default, 0.4),
                                backdropFilter: 'blur(8px)',
                              }}
                            >
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <FlashOn sx={{ fontSize: 18 }} /> Goal:
                                </Box> 
                                {details.goal}
                              </Typography>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center', 
                                  gap: 1
                                }}
                              >
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                  }}
                                >
                                  <Notes sx={{ fontSize: 18 }} /> Focus:
                                </Box> 
                                {details.focus}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              color: 'primary.main', 
                              px: 3, 
                              mb: 2, 
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <FitnessCenter sx={{ fontSize: 20 }} /> 
                            Exercises
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 3, pb: 3, flex: 1 }}>
                            {details.exercises?.map((exercise, index) => (
                              <Paper 
                                key={index} 
                                elevation={0} 
                                sx={{ 
                                  p: 2.5, 
                                  borderRadius: 3,
                                  background: 'linear-gradient(145deg, rgba(46, 48, 58, 0.7) 0%, rgba(38, 40, 48, 0.7) 100%)',
                                  backdropFilter: 'blur(5px)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 4,
                                    background: 'linear-gradient(to bottom, rgb(24, 239, 199), rgb(93, 243, 217))',
                                  }
                                }}
                              >
                                <Typography 
                                  variant="h3" 
                                  component="h4" 
                                  sx={{ 
                                    fontSize: '1.05rem', 
                                    fontWeight: 700, 
                                    color: 'white', 
                                    mb: 1,
                                    pl: 0.5
                                  }}
                                >
                                  {exercise.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 6,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    mb: 1.5,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                  }}
                                >
                                  {exercise.sets} • {exercise.reps}
                                </Box>
                                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', pl: 0.5 }}>
                                  {exercise.notes}
                                </Typography>
                                {exercise.video?.startsWith('http') && (
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<YouTube />}
                                    component="a"
                                    href={exercise.video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                      borderRadius: '50px',
                                      borderColor: alpha(theme.palette.primary.main, 0.5),
                                      '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                      }
                                    }}
                                  >
                                    Watch Demo
                                  </Button>
                                )}
                              </Paper>
                            ))}
                          </Box>
                        </CardContent>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                          <Button
                            variant="contained"
                            color={plansByWeek[selectedWeek].completedDays[day] ? 'success' : 'primary'}
                            onClick={() => toggleComplete(day)}
                          >
                            {plansByWeek[selectedWeek].completedDays[day] ? 'Completed' : 'Complete'}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            {/* Generate Week 4 button */}
            {selectedWeek === 4 && !plansByWeek[4] && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                {w3Comp >= 2 ? (
                  <Button variant="contained" onClick={handleGenerateWeek4} disabled={isWeek4Loading}>
                    {isWeek4Loading ? 'Generating Week 4...' : 'Generate Week 4 Plan'}
                  </Button>
                ) : (
                  <Typography>Week 4 workouts unlock after completing at least 2 days of Week 3</Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default WorkoutPlanGenerator;